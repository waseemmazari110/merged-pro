
import { makeSignature, hashPassword, verifyPassword } from "better-auth/crypto";

async function main() {
    const password = "password123";
    const secret = "iGPFLmO11lLAHHlfdIaPR1ujXlaf3VtbPtCiIWzOE+0=";
    
    // 1. Simulate Signup (with secret)
    const passwordToHash = await makeSignature(password, secret);
    const hash = await hashPassword(passwordToHash);
    console.log("Generated Hash:", hash);
    
    // 2. Simulate Signin (with the hook logic)
    const passwordToVerify = await makeSignature(password, secret);
    const isValid = await verifyPassword({ password: passwordToVerify, hash });
    console.log("Is Valid (with manual HMAC):", isValid);
    
    // 3. Simulate Signin (WITHOUT manual HMAC)
    const isValidNoHmac = await verifyPassword({ password, hash });
    console.log("Is Valid (without manual HMAC):", isValidNoHmac);
}

main().catch(console.error);
