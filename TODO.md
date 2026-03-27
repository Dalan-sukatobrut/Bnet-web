# Update FourNet Phone Number to 0811-4430-2898

## Steps:

- [x] 1. Run `node scripts/fix-fournet-phone.mjs` to update database image alts/descriptions (already up-to-date)
- [x] 2. Edit src/components/Packages.jsx hardcoded WA links and dynamic fallback (updated all FourNet/Lite/Bandwidth defaults & dynamic)
- [x] 3. Edit src/App.jsx floating WA button and footer phone display (WA updated, footer to formatted 0811-4430-2898)
- [ ] 4. Verify with `node scripts/query-fournet-phone.mjs` and browser test
- [ ] 5. Restart dev server `npm run dev` and test buttons open correct WA
