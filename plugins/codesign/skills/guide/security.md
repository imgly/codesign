> This is one page of the CE.SDK Node.js documentation. For a complete overview, see the [Node.js Documentation Index](https://img.ly/docs/cesdk/node.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Compatibility & Security](./compatibility.md) > [Security](./security.md)

---

This document provides a comprehensive overview of CE.SDK's security practices, focusing on data handling, privacy, and our commitment to maintaining the highest standards of security for our customers and their end users.

## Key Security Features

- **Client-Side Processing**: All image and design processing occurs directly on the user's device or your servers, not on our servers
- **No Data Transmission**: Your content (e.g. images, designs, templates, videos, audio, etc.) is never uploaded to or processed on IMG.LY servers
- **Minimal Data Collection**: We only collect device identifiers and count exports for licensing purposes
- **GDPR Compliance**: Our data collection practices adhere to GDPR regulations
- **Secure Licensing**: Enterprise licenses are secured with RSA SHA256 encryption

## Data Protection & Access Controls

### Data Collection

CE.SDK requires minimal data to provide its services. The only potentially personally identifiable information (PII) collected includes device-specific identifiers such as `identifierForVendor` on iOS and `ANDROID_ID` on Android. These identifiers are:

- Used solely for tracking monthly active users for our usage-based pricing models
- Reset when the user reinstalls the app or resets their device
- Collected under GDPR's legitimate interest provision (no explicit consent required as they are necessary for our licensing system)

Additionally, we track export operations for billing purposes in usage-based pricing models.

For enterprise customers who prefer more accurate tracking, integrators can provide their own userID. This allows for more precise measurement of usage without requiring additional device identifiers.

### Data Storage & Encryption

**We do not collect or store user data beyond the device identifiers and export counts mentioned above.** Since CE.SDK operates entirely on the device or server running the engine:

- All content processing happens on the device or server running the engine
- No images, designs, or user content is transmitted to IMG.LY servers
- No content data is stored on IMG.LY infrastructure

We use standard HTTPS (SSL/TLS) encryption for all communications between CE.SDK instances and our licensing backend.

### Access Controls

We are using established industry standard practices to handle sensitive customer data. Therefore access control concerns are minimized. The limited data we do handle is protected as follows:

- Billing information is stored in Stripe and accessed only by members of our finance team and C-level executives
- API keys and credentials are stored securely in 1Password or GitHub with granular access levels
- All employees sign Confidentiality Agreements to protect customer information

This refers to data of our direct customers, not their users or customers.

## Licensing System

CE.SDK uses a licensing system that works as follows:

1. During instantiation, an API key is provided to the CE.SDK instance
2. This API key is held in memory (never stored permanently on the device)
3. The SDK validates the key with our licensing backend
4. Upon successful validation, the backend returns a temporary local license
5. This license is periodically refreshed to maintain valid usage

For browser implementations, we protect licenses against misuse by pinning them to specific domains. For mobile applications, licenses are pinned to the application identifiers to prevent unauthorized use.

For enterprise customers, we offer an alternative model:

- A license file is passed directly to the instance
- No communication with our licensing service is required
- Licenses are secured using RSA SHA256 encryption

### CE.SDK Renderer

CE.SDK Renderer is a specialized variant of CE.SDK that consists of a native Linux binary bundled in a Docker container. It uses GPU acceleration and native code to render scenes and archives to various export formats.

Due to bundled third-party codecs (mainly H.264 & H.265) and their associated patent requirements, CE.SDK Renderer implements additional licensing communication beyond the standard licensing handshake:

1. **Initial License Validation**: The tool performs the standard license validation with our licensing backend
2. **Periodic Heartbeats**: After successful validation, it sends periodic heartbeats to our licensing backend to track the number of active instances
3. **Instance Limits**: We limit the maximum number of active instances per license based on the settings in your dashboard
4. **Activation Control**: If the instance limit is exceeded, further activations (launches) of the tool will fail with a descriptive error message

This additional communication allows us to ensure compliance with codec licensing requirements while providing transparent usage tracking for your organization. As with all CE.SDK products, no user data (images, videos, designs, or other content) is transmitted to IMG.LY servers - only device identifiers and instance counts are collected for licensing purposes.

## Security Considerations for User Input

As CE.SDK deals primarily with arbitrary user input, we've implemented specific security measures to handle data safely:

- The CreativeEngine reads files from external resources to fetch images, fonts, structured data, and other sources for designs. These reads are safeguarded by platform-specific default measures.
- The engine never loads executable code or attempts to execute any data acquired from dynamic content. It generally relies on provided mime types to decode image data or falls back to byte-level inspection to choose the appropriate decoder.
- For data writing operations, we provide a callback that returns a pointer to the to-be-written data. The engine itself never unconditionally writes to an externally defined path. If it writes to files directly, these are part of internal directories and can't be modified externally.
- Generated PDFs may have original image files embedded if the image was not altered via effects or blurs and the `exportPdfWithHighCompatibility` option was **not** enabled. This means a malicious image file could theoretically be included in the exported PDF.
- Inline text-editing allows arbitrary input of strings by users. The engine uses platform-specific default inputs and APIs and doesn't apply additional sanitization. The acquired strings are stored and used exclusively for text rendering - they are neither executed nor used for file operations.

## Security Infrastructure

### Vulnerability Management

We take a proactive approach to security vulnerability management:

- We use GitHub to track dependency vulnerabilities
- We regularly update affected dependencies
- We don't maintain a private network, eliminating network vulnerability concerns in that context
- We don't manually maintain servers or infrastructure, as we don't have live systems beyond those required for licensing
- For storage and licensing, we use virtual instances in Google Cloud which are managed by the cloud provider
- All security-related fixes are published in our public changelog at [https://img.ly/docs/cesdk/changelog/](https://img.ly/docs/cesdk/changelog/)

### Security Development Practices

Our development practices emphasize security:

- We rely on established libraries with proven security track records
- We don't directly process sensitive user data in our code
- Secrets (auth tokens, passwords, API credentials, certificates) are stored in GitHub or 1Password with granular access levels
- We use RSA SHA256 encryption for our enterprise licenses
- We rely on platform-standard SSL implementations for HTTPS communications

### API Key Management

API keys for CE.SDK are handled securely:

- Keys are passed during instantiation and held in memory only
- Keys are never stored permanently on client devices
- For web implementation, keys are pinned to specific domains to prevent unauthorized use
- Enterprise licenses use a file-based approach that doesn't require API key validation

## Compliance

IMG.LY complies with the General Data Protection Regulation (GDPR) in all our operations, including CE.SDK. Our Privacy Policy is publicly available at [https://img.ly/privacy-policy](https://img.ly/privacy-policy).

Our local approach to content processing significantly reduces privacy and compliance concerns, as user content never leaves the environment running the engine.

## FAQ

### Does CE.SDK upload my images or designs to IMG.LY servers?

No. CE.SDK processes all content locally on the user's device. Your images, designs, and other content are never transmitted to IMG.LY servers.

### What data does IMG.LY collect through CE.SDK?

CE.SDK only collects device identifiers (such as identifierForVendor on iOS or ANDROID\_ID on Android) for licensing purposes and export counts. No user content or personal information is collected.

### How does IMG.LY protect API keys?

API keys are never stored permanently; they are held in memory during SDK operation. For web implementations, keys are pinned to specific domains to prevent unauthorized use.

### Has IMG.LY experienced any security breaches?

No, IMG.LY has not been involved in any cybersecurity breaches in the last 12 months.

### Does IMG.LY conduct security audits?

As we don't store customer data directly, but rely on third parties to do so, we focus our security efforts on dependency tracking and vulnerability management through GitHub's security features. We don't conduct security audits.

## Additional Information

For more detailed information about our data collection practices, please refer to our Data Privacy and Retention information below.

Should you have any additional questions regarding security practices or require more information, please contact our team at [support@img.ly](mailto:support@img.ly).

## Data Privacy and Retention

At IMG.LY, we prioritize your data privacy and ensure that apart from a minimal contractually stipulated set of interactions with our servers all other operations take place on your local device. Below is an overview of our data privacy and retention policies:

### **Data Processing**

All data processed by CE.SDK remains strictly on the device or server running the engine. We do not transfer your data to our servers for processing. This means that operations such as rendering, editing, and other in-app functionalities happen entirely locally, ensuring that sensitive project or personal data stays with you.

### **Data Retention**

We do not store any project-related data on our servers. Since all data operations occur locally, no information about your edits, images, or video content is retained by CE.SDK. The only data that interacts with our servers is related to license validation and telemetry related to usage tied to your pricing plan.

### **License Validation**

CE.SDK performs a license validation check with our servers once upon initialization to validate the software license being used. This interaction is minimal and does not involve the transfer of any personal, project, or media data.

### **Event Tracking**

While CE.SDK does not track user actions other than the exceptions listed below through telemetry or analytics by default, there are specific events tracked to manage customer usage, particularly for API key usage tracking. We gather the following information during these events:

- **When the engine loads:** App identifier, platform, engine version, user ID (provided by the client), device ID (mobile only), and session ID.
- **When a photo or video is exported:** User ID, device ID, session ID, media type (photo/video), format, resolution (width and height), page count (photo only), FPS (video only), and duration (video only).

This tracking is solely for ensuring accurate usage calculation and managing monthly active user billing. Enterprise clients can opt out of this tracking under specific agreements. For a precise definition of which operations count as an export and when export events are recorded, see [Export Counting](./export-counting.md).

### **Personal Identifiable Information (PII)**

The only PII that is potentially collected includes device-specific identifiers such as `identifierForVendor` on iOS and `ANDROID_ID` on Android. These IDs are used for tracking purposes and are reset when the user reinstalls the app or resets the device. No consent is required for these identifiers because they are crucial for our usage-based pricing models. This is covered by the GDPR as legitimate interest.

### **User Consent**

As mentioned above, user consent is not required when solely using the CE.SDK. However, this may change depending on the specific enterprise agreement or additional regulatory requirements.
IMG.LY is committed to maintaining compliance with **GDPR** and other applicable data protection laws, ensuring your privacy is respected at all times. For details consult our [privacy policy](https://img.ly/privacy-policy).



---

## More Resources

- **[Node.js Documentation Index](https://img.ly/docs/cesdk/node.md)** - Browse all Node.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./node.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support