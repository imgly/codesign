---
title: "System Compatibility"
description: "Learn how device performance and hardware limits affect CE.SDK editing, rendering, and export capabilities."
platform: node
url: "https://img.ly/docs/cesdk/archive/v1.84/node/compatibility-139ef9/"
---

> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt).

**Navigation:** [Compatibility & Security](https://img.ly/docs/cesdk/archive/v1.84/node/compatibility-fef719/) > [System Compatibility](https://img.ly/docs/cesdk/archive/v1.84/node/compatibility-139ef9/)

---

CE.SDK makes use of hardware acceleration provided within that environment. Therefore, the hardware always acts as an upper bound of what’s achievable.

The editor's performance scales with scene complexity. We generally found scenes with up to 200 blocks well usable, but complex blocks like auto-sizing text or high-resolution image fills may affect performance negatively. This is always constrained by the processing power available on the device, so for low-end devices, the experience may suffer earlier. Therefore, it’s generally desirable to keep scenes only as complex as needed.

## Hardware Limitations

Each device has a limited amount of high performance hardware decoders and encoders. If the maximum number is reached it will fall back to (slow) software de- and encoding. Therefore users may encounter slow export performance when trying to export in parallel with other software that utilizes encoders and decoders. This, unfortunately, is a limitation of hardware, operating system and browser and cannot be solved.

## Version

- **Node.js 22** or later

The reliance on CPU processing may yield lower export speeds when compared to web browsers.

## Recommended Hardware

No specific CPU requirements, but export time scales with processing power and we recommend at least 2GB of memory.

## Video

Video is **not supported** in Node.js.

## Export Limitations

The export size is limited by the hardware capabilities of the device, e.g., due to the maximum texture size that can be allocated. The maximum possible export size can be queried via API, see [export guide](https://img.ly/docs/cesdk/archive/v1.84/node/export-save-publish/export/overview-9ed3a8/).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/archive/v1.84/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/archive/v1.84/node/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support
