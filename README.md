# n8n-nodes-ocean-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Ocean Protocol, enabling seamless automation of decentralized data marketplace operations. This node provides access to 6 key resources including assets, datatokens, compute jobs, veOcean governance, orders, and providers, allowing you to build powerful Web3 data workflows within n8n.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Ocean Protocol](https://img.shields.io/badge/Ocean%20Protocol-Compatible-0891b2)
![Web3](https://img.shields.io/badge/Web3-Enabled-orange)
![Data Marketplace](https://img.shields.io/badge/Data-Marketplace-green)

## Features

- **Asset Management** - Create, update, publish, and discover data assets in the Ocean Protocol ecosystem
- **Datatoken Operations** - Mint, transfer, and manage ERC-20 datatokens for data access control
- **Compute-to-Data** - Execute privacy-preserving computations on distributed datasets
- **veOcean Governance** - Participate in Ocean Protocol governance through veOcean token operations
- **Order Processing** - Handle data asset purchases, downloads, and access management
- **Provider Integration** - Interact with Ocean Protocol providers for data storage and compute services
- **Multi-Network Support** - Compatible with Ethereum, Polygon, and other supported Ocean networks
- **Enterprise Ready** - Built for production workflows with comprehensive error handling

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ocean-protocol`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-ocean-protocol
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-ocean-protocol.git
cd n8n-nodes-ocean-protocol
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ocean-protocol
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Ocean Protocol API key for authentication | Yes |
| Network | Target blockchain network (mainnet, polygon, etc.) | Yes |
| Private Key | Wallet private key for transaction signing | Yes |
| Provider URL | Ocean Protocol provider endpoint URL | No |
| Aquarius URL | Metadata service endpoint URL | No |

## Resources & Operations

### 1. Asset

| Operation | Description |
|-----------|-------------|
| Create | Create a new data asset with metadata and pricing |
| Get | Retrieve asset details by DID or address |
| Update | Update asset metadata and configuration |
| Publish | Publish an asset to make it discoverable |
| Search | Search for assets using filters and keywords |
| Delete | Remove an asset from the marketplace |

### 2. Datatoken

| Operation | Description |
|-----------|-------------|
| Create | Deploy a new datatoken contract |
| Mint | Mint new datatoken supply |
| Transfer | Transfer datatokens between addresses |
| Burn | Burn datatokens to reduce supply |
| Get Balance | Check datatoken balance for an address |
| Approve | Approve spending allowance for datatokens |

### 3. ComputeJob

| Operation | Description |
|-----------|-------------|
| Start | Initiate a compute-to-data job |
| Get Status | Check the status of a running job |
| Get Results | Retrieve completed job results |
| Stop | Cancel a running compute job |
| Get Logs | Fetch execution logs for debugging |
| List Jobs | Get all jobs for a user or dataset |

### 4. VeOcean

| Operation | Description |
|-----------|-------------|
| Lock | Lock OCEAN tokens to receive veOcean |
| Unlock | Unlock OCEAN tokens after lock period |
| Get Balance | Check veOcean balance and lock details |
| Delegate | Delegate veOcean voting power |
| Vote | Cast votes on governance proposals |
| Get Rewards | Claim data farming and governance rewards |

### 5. Order

| Operation | Description |
|-----------|-------------|
| Create | Place an order to access a data asset |
| Get | Retrieve order details and status |
| Download | Download purchased data asset |
| Get History | View order history for an account |
| Cancel | Cancel a pending order |
| Validate | Validate order requirements before purchase |

### 6. Provider

| Operation | Description |
|-----------|-------------|
| Get Info | Retrieve provider service information |
| Check Status | Check provider health and availability |
| Get Services | List available provider services |
| Validate | Validate provider compatibility |
| Get Endpoints | Retrieve provider API endpoints |
| Test Connection | Test connectivity to provider services |

## Usage Examples

```javascript
// Create a new data asset
{
  "metadata": {
    "name": "Weather Data 2024",
    "description": "Comprehensive weather dataset for machine learning",
    "type": "dataset",
    "author": "WeatherCorp",
    "license": "CC-BY-4.0"
  },
  "pricing": {
    "type": "fixed",
    "price": "10",
    "token": "OCEAN"
  },
  "files": [{
    "url": "https://example.com/weather-data.csv",
    "contentType": "text/csv"
  }]
}
```

```javascript
// Start a compute-to-data job
{
  "dataset": "did:op:123abc456def",
  "algorithm": "did:op:789ghi012jkl",
  "compute": {
    "env": "python",
    "resources": {
      "cpu": 2,
      "memory": "4GB",
      "storage": "10GB"
    }
  },
  "additionalDatasets": [
    "did:op:345mno678pqr"
  ]
}
```

```javascript
// Search for data assets
{
  "query": "machine learning",
  "filters": {
    "categories": ["AI", "datasets"],
    "priceRange": {
      "min": 0,
      "max": 100
    },
    "license": ["CC-BY", "CC0"]
  },
  "sort": "created",
  "limit": 20
}
```

```javascript
// Lock OCEAN tokens for veOcean
{
  "amount": "1000",
  "lockPeriod": "4", // 4 years for maximum veOcean
  "recipient": "0x742d35Cc6635C0532925a3b8D657E3a8A1234567"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid DID Format | Provided DID doesn't match Ocean Protocol format | Ensure DID follows 'did:op:' format with valid checksum |
| Insufficient Balance | Not enough tokens for transaction | Check wallet balance and ensure sufficient OCEAN tokens |
| Provider Unreachable | Cannot connect to Ocean Protocol provider | Verify provider URL and network connectivity |
| Compute Job Failed | Compute-to-data execution failed | Check algorithm compatibility and dataset permissions |
| Asset Not Found | Requested asset doesn't exist | Verify asset DID and ensure asset is published |
| Network Mismatch | Wrong blockchain network configured | Ensure network setting matches asset's deployment network |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ocean-protocol/issues)
- **Ocean Protocol Docs**: [Ocean Protocol Documentation](https://docs.oceanprotocol.com/)
- **Ocean Community**: [Ocean Protocol Discord](https://discord.com/invite/TnXjkR5)