# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

We take security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report a Security Vulnerability

Please do **NOT** report security vulnerabilities through public GitHub issues.

Instead, please report them via email to [suryanshu.nabheet@gmail.com](mailto:suryanshu.nabheet@gmail.com).

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

After you submit a report, we will:

1. Confirm receipt of your vulnerability report within 48 hours
2. Provide regular updates on our progress
3. Credit you in our security advisories (unless you prefer to remain anonymous)

### Security Best Practices

When using CoderX, please follow these security best practices:

1. **API Keys**: Never commit API keys to version control. Use environment variables or secure configuration files.
2. **Dependencies**: Keep all dependencies up to date to avoid known vulnerabilities.
3. **Input Validation**: Always validate and sanitize user inputs.
4. **HTTPS**: Use HTTPS in production environments.
5. **Authentication**: Implement proper authentication and authorization mechanisms.

### Security Features

CoderX includes several security features:

- **Environment Variable Protection**: Sensitive configuration is handled through environment variables
- **Input Sanitization**: User inputs are properly sanitized and validated
- **Secure Defaults**: The application ships with secure default configurations
- **Dependency Scanning**: Regular dependency updates and vulnerability scanning

### Contact

For security-related questions or concerns, please contact:

- **Email**: [suryanshu.nabheet@gmail.com](mailto:suryanshu.nabheet@gmail.com)
- **GitHub**: [@Suryanshu-Nabheet](https://github.com/Suryanshu-Nabheet)

Thank you for helping keep CoderX and our users safe!
