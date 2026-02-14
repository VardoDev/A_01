# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by emailing the maintainer or creating a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Security Best Practices

### For Users

1. **Never share your private keys** - This application never asks for your private keys
2. **Verify wallet connections** - Always check the wallet address before signing transactions
3. **Use hardware wallets** - For large amounts, consider using hardware wallets like Ledger
4. **Check the network** - Ensure you're connected to the correct network (devnet/mainnet)

### For Developers

1. **Keep dependencies updated** - Run `npm audit` regularly
2. **Never commit secrets** - Use `.env` files for sensitive data
3. **Review code changes** - Carefully review all code changes, especially in wallet-related code
4. **Test thoroughly** - Test all wallet interactions on devnet before mainnet deployment

## Security Checklist

- [x] Secrets are in `.gitignore`
- [x] No hardcoded API keys
- [x] External links use `rel="noopener noreferrer"`
- [x] No use of `dangerouslySetInnerHTML`
- [x] No use of `eval()`
- [ ] CSP headers configured (TODO)
- [ ] Environment variables for RPC endpoints (TODO)
- [ ] Regular dependency updates (TODO)

## Known Security Considerations

### Current Network: Devnet

This application is currently configured to use Solana **devnet**. Devnet tokens have no real value. Before deploying to mainnet:

1. Update `WalletContextProvider.tsx` to use `mainnet-beta`
2. Configure production RPC endpoints
3. Add transaction confirmations
4. Implement rate limiting
5. Add comprehensive error handling

### Dependencies

This project uses third-party wallet adapters. Security of wallet connections depends on:

- Solana Wallet Adapter libraries
- Individual wallet implementations (Phantom, Solflare, etc.)
- Browser security

Always keep these dependencies updated to the latest versions.

## Security Updates

Check the [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) file for the latest security audit results and recommendations.

Last security audit: February 14, 2026
