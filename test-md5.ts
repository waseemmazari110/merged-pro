
import crypto from "node:crypto";

function verifyMd5(password: string, hash: string): boolean {
    if (hash.length === 32 && /^[0-9a-f]+$/.test(hash)) {
        const md5Hash = crypto.createHash("md5").update(password).digest("hex");
        return md5Hash === hash;
    }
    return false;
}

const testCases = [
    { email: "cswaseem110@gmail.com", hash: "02699eccbc5bb7b49931df6a465258d9" },
    { email: "yasirmahar1511@gmail.com", hash: "a1307b49dedef7257a34f2f466056555" },
    { email: "danharley2006@yahoo.co.uk", hash: "e3d7bee2ef8910e14d962f6f4cb2d5dd" }
];

// We don't know the passwords, but we can test common ones or just see if the logic is sound.
console.log("Testing MD5 verification logic...");
testCases.forEach(tc => {
    console.log(`Hash for ${tc.email}: ${tc.hash} (Length: ${tc.hash.length})`);
});
