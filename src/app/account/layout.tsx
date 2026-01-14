// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
