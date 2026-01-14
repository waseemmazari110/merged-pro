"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface SeasonalPrice {
  id?: number;
  name: string;
  seasonType: "peak" | "high" | "mid" | "low" | "off-peak";
  startDate: string;
  endDate: string;
  pricePerNight: number;
  minimumStay?: number;
  dayType: "weekday" | "weekend" | "any";
}

interface PricingFieldsManagerProps {
  basePrice?: number;
  weekendPrice?: number;
  cleaningFee?: number;
  securityDeposit?: number;
  seasonalPrices?: SeasonalPrice[];
  onBasePriceChange: (price: number) => void;
  onWeekendPriceChange: (price: number | undefined) => void;
  onCleaningFeeChange: (fee: number | undefined) => void;
  onSecurityDepositChange: (deposit: number | undefined) => void;
  onSeasonalPricesChange?: (prices: SeasonalPrice[]) => void;
  currency?: string;
  showSeasonalPricing?: boolean;
}

export function PricingFieldsManager({
  basePrice,
  weekendPrice,
  cleaningFee,
  securityDeposit,
  seasonalPrices = [],
  onBasePriceChange,
  onWeekendPriceChange,
  onCleaningFeeChange,
  onSecurityDepositChange,
  onSeasonalPricesChange,
  currency = "£",
  showSeasonalPricing = true,
}: PricingFieldsManagerProps) {
  const [localSeasonalPrices, setLocalSeasonalPrices] = useState<SeasonalPrice[]>(seasonalPrices);

  // Format price for display
  const formatPrice = (value: number | undefined): string => {
    if (value === undefined || value === null) return "";
    return value.toFixed(2);
  };

  // Parse price from input
  const parsePrice = (value: string): number | undefined => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) || parsed < 0 ? undefined : parsed;
  };

  // Validate price input
  const validatePrice = (value: number | undefined, fieldName: string): boolean => {
    if (value === undefined) return true; // Optional fields
    if (value < 0) {
      toast.error(`${fieldName} cannot be negative`);
      return false;
    }
    if (value > 100000) {
      toast.error(`${fieldName} seems unusually high. Please verify.`);
      return false;
    }
    return true;
  };

  // Handle base price change
  const handleBasePriceChange = (value: string) => {
    const price = parsePrice(value);
    if (price !== undefined && validatePrice(price, "Base price")) {
      onBasePriceChange(price);
    }
  };

  // Handle weekend price change
  const handleWeekendPriceChange = (value: string) => {
    const price = parsePrice(value);
    if (validatePrice(price, "Weekend price")) {
      onWeekendPriceChange(price);
    }
  };

  // Handle cleaning fee change
  const handleCleaningFeeChange = (value: string) => {
    const fee = parsePrice(value);
    if (validatePrice(fee, "Cleaning fee")) {
      onCleaningFeeChange(fee);
    }
  };

  // Handle security deposit change
  const handleSecurityDepositChange = (value: string) => {
    const deposit = parsePrice(value);
    if (validatePrice(deposit, "Security deposit")) {
      onSecurityDepositChange(deposit);
    }
  };

  // Add new seasonal pricing
  const addSeasonalPrice = () => {
    const newPrice: SeasonalPrice = {
      name: "New Season",
      seasonType: "mid",
      startDate: "",
      endDate: "",
      pricePerNight: basePrice || 100,
      dayType: "any",
    };
    const updated = [...localSeasonalPrices, newPrice];
    setLocalSeasonalPrices(updated);
    onSeasonalPricesChange?.(updated);
  };

  // Remove seasonal pricing
  const removeSeasonalPrice = (index: number) => {
    const updated = localSeasonalPrices.filter((_, i) => i !== index);
    setLocalSeasonalPrices(updated);
    onSeasonalPricesChange?.(updated);
  };

  // Update seasonal pricing
  const updateSeasonalPrice = (index: number, updates: Partial<SeasonalPrice>) => {
    const updated = localSeasonalPrices.map((price, i) =>
      i === index ? { ...price, ...updates } : price
    );
    setLocalSeasonalPrices(updated);
    onSeasonalPricesChange?.(updated);
  };

  return (
    <div className="space-y-8">
      {/* Base Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Base Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Price */}
          <div>
            <Label htmlFor="base_price" className="text-gray-900">
              Base Price (per night) *
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
              <Input
                id="base_price"
                type="number"
                min="0"
                step="0.01"
                value={formatPrice(basePrice)}
                onChange={(e) => handleBasePriceChange(e.target.value)}
                className="pl-8 text-gray-900"
                placeholder="0.00"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Midweek nightly rate</p>
          </div>

          {/* Weekend Price */}
          <div>
            <Label htmlFor="weekend_price" className="text-gray-900">
              Weekend Price (per night)
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
              <Input
                id="weekend_price"
                type="number"
                min="0"
                step="0.01"
                value={formatPrice(weekendPrice)}
                onChange={(e) => handleWeekendPriceChange(e.target.value)}
                className="pl-8 text-gray-900"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Friday-Sunday rate (optional)</p>
          </div>

          {/* Cleaning Fee */}
          <div>
            <Label htmlFor="cleaning_fee" className="text-gray-900">
              Cleaning Fee
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
              <Input
                id="cleaning_fee"
                type="number"
                min="0"
                step="0.01"
                value={formatPrice(cleaningFee)}
                onChange={(e) => handleCleaningFeeChange(e.target.value)}
                className="pl-8 text-gray-900"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">One-time cleaning charge</p>
          </div>

          {/* Security Deposit */}
          <div>
            <Label htmlFor="security_deposit" className="text-gray-900">
              Security Deposit
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currency}
              </span>
              <Input
                id="security_deposit"
                type="number"
                min="0"
                step="0.01"
                value={formatPrice(securityDeposit)}
                onChange={(e) => handleSecurityDepositChange(e.target.value)}
                className="pl-8 text-gray-900"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Refundable deposit</p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 text-sm">Pricing Summary</h4>
              <div className="mt-2 space-y-1 text-sm text-blue-800">
                {basePrice ? (
                  <p>Midweek: <span className="font-medium">{currency}{formatPrice(basePrice)}</span> per night</p>
                ) : (
                  <p className="text-gray-500 italic">Set base price above</p>
                )}
                {weekendPrice && (
                  <p>Weekend: <span className="font-medium">{currency}{formatPrice(weekendPrice)}</span> per night</p>
                )}
                {cleaningFee && (
                  <p>Cleaning: <span className="font-medium">{currency}{formatPrice(cleaningFee)}</span> one-time</p>
                )}
                {securityDeposit && (
                  <p>Deposit: <span className="font-medium">{currency}{formatPrice(securityDeposit)}</span> refundable</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Pricing */}
      {showSeasonalPricing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Seasonal Pricing</h3>
              <p className="text-sm text-gray-500">Set different prices for peak seasons</p>
            </div>
            <Button
              type="button"
              onClick={addSeasonalPrice}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Season
            </Button>
          </div>

          {localSeasonalPrices.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No seasonal pricing configured</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Season" to create seasonal rates</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localSeasonalPrices.map((seasonPrice, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Input
                      value={seasonPrice.name}
                      onChange={(e) =>
                        updateSeasonalPrice(index, { name: e.target.value })
                      }
                      className="flex-1 mr-4 font-medium"
                      placeholder="Season name"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSeasonalPrice(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Season Type */}
                    <div>
                      <Label className="text-gray-900">Season Type</Label>
                      <Select
                        value={seasonPrice.seasonType}
                        onValueChange={(value) =>
                          updateSeasonalPrice(index, {
                            seasonType: value as SeasonalPrice["seasonType"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peak">Peak Season</SelectItem>
                          <SelectItem value="high">High Season</SelectItem>
                          <SelectItem value="mid">Mid Season</SelectItem>
                          <SelectItem value="low">Low Season</SelectItem>
                          <SelectItem value="off-peak">Off-Peak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Day Type */}
                    <div>
                      <Label className="text-gray-900">Days</Label>
                      <Select
                        value={seasonPrice.dayType}
                        onValueChange={(value) =>
                          updateSeasonalPrice(index, {
                            dayType: value as SeasonalPrice["dayType"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Day</SelectItem>
                          <SelectItem value="weekday">Weekdays Only</SelectItem>
                          <SelectItem value="weekend">Weekends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Start Date */}
                    <div>
                      <Label className="text-gray-900">Start Date</Label>
                      <Input
                        type="date"
                        value={seasonPrice.startDate}
                        onChange={(e) =>
                          updateSeasonalPrice(index, { startDate: e.target.value })
                        }
                        className="text-gray-900"
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <Label className="text-gray-900">End Date</Label>
                      <Input
                        type="date"
                        value={seasonPrice.endDate}
                        onChange={(e) =>
                          updateSeasonalPrice(index, { endDate: e.target.value })
                        }
                        className="text-gray-900"
                      />
                    </div>

                    {/* Price Per Night */}
                    <div>
                      <Label className="text-gray-900">Price Per Night</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          {currency}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formatPrice(seasonPrice.pricePerNight)}
                          onChange={(e) => {
                            const price = parsePrice(e.target.value);
                            if (price !== undefined) {
                              updateSeasonalPrice(index, { pricePerNight: price });
                            }
                          }}
                          className="pl-8 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Minimum Stay */}
                    <div>
                      <Label className="text-gray-900">Minimum Stay (nights)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={seasonPrice.minimumStay || ""}
                        onChange={(e) =>
                          updateSeasonalPrice(index, {
                            minimumStay: parseInt(e.target.value) || undefined,
                          })
                        }
                        className="text-gray-900"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
