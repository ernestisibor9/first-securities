# Image Dimension Verification

## 1. customer.png

- **Native Dimensions:** 1600 x 896
- **Current Usage:**
  - Styled via `mainImage`.
  - `width: "90%"`
  - `aspectRatio: 16 / 9` (~1.78)
  - The native aspect ratio is precisely 1.7857 (very close to 16:9).

## 2. fslogo2.png (Logo)

- **Native Dimensions:** 330 x 100
- **Current Usage:**
  - `width: 320`
  - `height: 100`
  - `resizeMode: "contain"`
- **Note:** You mentioned 320x100; the actual image is slightly wider at 330px, so it's currently being slightly scaled down to fit the 320px width limit in your code.

# Recent Tasks
## Programmatic Orientation Control
- [x] Set `app.json` orientation to `default`.
- [x] Lock root layout to `PORTRAIT_UP`.
- [x] Implement selective unlock in `marketinsight`, `pricechart`, `dailypricelist`, `login`, and `signup`.
- [x] Clean up `useOrientation` hook to remove automatic global unlocking.

