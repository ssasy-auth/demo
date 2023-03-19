# ssasy demo

This is a demo of the self-sovereign authentication scheme (SSASy).

In order to follow along, it is recommended to have a basic understanding of:

- `ssasy` - the self-sovereign authentication scheme which this repository is built upon (see the [ssasy repository](https://github.com/this-oliver/ssasy) for more information)
- `ssasy-extension` - the browser extension which is used to authenticate with the ssasy scheme (see the [ssasy-extension repository](https://github.com/this-oliver/ssasy-extension) for more information)

## getting started

In order to use use the demo, you need a test key. You can generate one with the `ssasy` library or you can use the test key provided below.

```json
{
  "type": "private-key",
  "crypto": {
    "crv": "P-256",
    "d": "Udw4rlpbJX2N5qtiBNtwYnd7Me0ek1BKASEDLQr5UUM",
    "ext": true,
    "key_ops": [
      "deriveKey"
    ],
    "kty": "EC",
    "x": "d9oZ6UPqNeRu3Goq8LC3BjoC2zYcStWoakMDvYEwVn0",
    "y": "AFC-mBqsXFcTFl3vMs4L_tTc03j-_OBfefh_deJlJi4"
  }
}
```
