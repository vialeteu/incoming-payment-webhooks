# VIALET incoming payment webhooks

This repository contains script to test the VIALET incoming payment webhooks. `webhooks.json` file provides a list of example webhooks with payment status that will be sent one-by-one to the specified URL.

Repository includes:
- Examples of request body structure for incoming payment webhooks.
- Example of verification of the request signature in `x-api-signature` header. Each webhook coming from VIALET is signed by RSA (type1) signature.  
- Basic validation schema for the incoming request body.

## Quick start

1. Change the `WEBHOOK_URL` in the `.env` file to the URL you want to test.

2. Install the dependencies:

```bash
npm install
```

3. Run the script:

```bash
npm start
```

4. Check the output in the console and logs of the server that receives the webhooks.

## Additional customization

- You can change the payload in the `webhooks.json` file to test different scenarios. Each webhook body is validated when test script is executed. If the validation fails, the script will log an error message.

## References

- [Webhooks documentation](https://vialet.notion.site/Webhooks-NANO-4e2c4016bfe74a8b9ddaf118449442a7)
