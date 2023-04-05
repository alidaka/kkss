# [KiKaSS](https://kkss.lidaka.io/): k-key secret sharing

### Introduction
KiKaSS is a secret encryption and deconstruction application. If you have a secret (password, encryption key, etc.), KKSS can decompose it into an arbitrary number of partial-keys, of which an arbitrary-sized subset is required to reconstruct the original key.

For example: 8 people need access to a safe. However, at least 3 people must be present to unlock it--no individual can open it alone.

### Background
The core functionality depends heavily on [Shamir's Secret Sharing Scheme](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing).

For larger secrets (messages, documents, etc.), we use symmetric encryption; partial key distributed to users are decomposed AES keys.

### Goals
1. Cryptographic security
2. Transparency
    1. Do as much work client-side as possible
    2. Never send or store anything unencrypted
    3. Minimize surface area, e.g. against man-in-the-middle
    4. Clients shouldn't be required to trust our server
3. Usability

### Development Set Up
- First you'll need to install neccessary gems for the project by running:
```
bundle install
```
- Run the tests:
```
rake
```
- To run the application locally run the following from the kkss directory:
```
rake run
```
- Visit the application: `http://localhost:4567`

### Future work?
- Obscure partial keys when entering
- Encrypt and store messages (in progress)
- Encrypt and store documents
- Diceware for keys
- P2P key entry (rather than single-station; `RTCDataChannel` via [WebRTC](https://webrtc.org/))
- When decomposing short secrets, should we pad them so the original secret length is not so clearly exposed (linear growth partial key length)?
- More flexible partial key hierarchy: e.g., decompose 8 partial keys, of which any 3 are needed to reconstruct the secret, but one of them
