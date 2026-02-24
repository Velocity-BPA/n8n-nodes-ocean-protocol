# n8n-nodes-ocean-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Ocean Protocol's decentralized data ecosystem, offering 5 comprehensive resources for managing data NFTs, datatokens, compute-to-data operations, governance tokens, and asset metadata with full Web3 capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Ocean Protocol](https://img.shields.io/badge/Ocean%20Protocol-v4-0891b2)
![Web3](https://img.shields.io/badge/Web3-Enabled-green)
![DeFi](https://img.shields.io/badge/DeFi-Compatible-purple)

## Features

- **DataNFT Management** - Create, mint, transfer, and manage data NFTs with full ownership control
- **Datatoken Operations** - Deploy, mint, burn, and transfer datatokens for data access monetization
- **Compute-to-Data Integration** - Execute privacy-preserving computations on remote datasets
- **VeOcean Governance** - Stake OCEAN tokens, participate in governance, and earn rewards
- **Asset Metadata Handling** - Create, update, and retrieve comprehensive dataset metadata
- **Multi-Chain Support** - Works across Ethereum, Polygon, BSC, and other supported networks
- **Real-time Monitoring** - Track transaction status and blockchain confirmations
- **Batch Processing** - Handle multiple operations efficiently in single workflows

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
| Private Key | Wallet private key for signing transactions | Yes |
| Network | Target network (mainnet, polygon, rinkeby, mumbai) | Yes |
| RPC URL | Custom RPC endpoint (optional, uses default if empty) | No |
| API Key | Ocean Protocol API key for enhanced features | No |

## Resources & Operations

### 1. DataNFTs

| Operation | Description |
|-----------|-------------|
| Create | Deploy a new DataNFT contract with custom metadata |
| Mint | Mint new DataNFT tokens to specified addresses |
| Transfer | Transfer DataNFT ownership between addresses |
| Get Details | Retrieve DataNFT contract information and metadata |
| Set Metadata | Update DataNFT metadata and description |
| List Tokens | Get all DataNFTs owned by an address |

### 2. Datatokens

| Operation | Description |
|-----------|-------------|
| Deploy | Create new datatoken contract linked to DataNFT |
| Mint | Mint datatokens for data access distribution |
| Burn | Burn datatokens to reduce supply |
| Transfer | Send datatokens between addresses |
| Approve | Approve spending allowance for another address |
| Get Balance | Check datatoken balance for specific address |
| Get Supply | Retrieve total and circulating supply information |

### 3. ComputeToData

| Operation | Description |
|-----------|-------------|
| Start Job | Initialize compute job on remote dataset |
| Get Job Status | Check status and progress of running jobs |
| Get Results | Retrieve computation results and outputs |
| Cancel Job | Stop running compute job |
| List Jobs | Get all compute jobs for user or dataset |
| Get Algorithms | Retrieve available algorithms for computation |

### 4. VeOcean

| Operation | Description |
|-----------|-------------|
| Lock Tokens | Lock OCEAN tokens for veOCEAN governance power |
| Unlock Tokens | Unlock previously locked OCEAN tokens |
| Get Balance | Check veOCEAN balance and voting power |
| Claim Rewards | Claim available staking rewards |
| Vote | Participate in Ocean Protocol governance voting |
| Get Proposals | Retrieve active and past governance proposals |

### 5. AssetMetadata

| Operation | Description |
|-----------|-------------|
| Create | Create comprehensive metadata for data assets |
| Update | Modify existing asset metadata and properties |
| Get | Retrieve complete metadata for specific asset |
| Search | Search assets by metadata criteria |
| Validate | Validate metadata structure and compliance |
| Delete | Remove asset metadata from registry |

## Usage Examples

```javascript
// Create a new DataNFT for climate data
{
  "name": "Climate Research Dataset",
  "symbol": "CLIMATE",
  "templateIndex": 1,
  "tokenURI": "https://metadata.oceanprotocol.com/climate-data.json",
  "transferable": true,
  "owner": "0x742d35Cc6634C0532925a3b8D1b9173A38d07279"
}
```

```javascript
// Deploy datatoken for dataset access
{
  "name": "Climate Data Access Token",
  "symbol": "CDAT",
  "templateIndex": 1,
  "cap": "1000000",
  "feeAmount": "0.1",
  "paymentCollector": "0x123...abc",
  "feeToken": "0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
}
```

```javascript
// Start compute-to-data job
{
  "dataset": "0x456...def",
  "algorithm": "0x789...ghi",
  "computeEnv": "ocean-compute-env-1",
  "parameters": {
    "epochs": 100,
    "learning_rate": 0.001
  }
}
```

```javascript
// Lock OCEAN tokens for governance
{
  "amount": "1000",
  "lockDuration": 31536000,
  "recipient": "0x742d35Cc6634C0532925a3b8D1b9173A38d07279"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Insufficient Balance | Not enough tokens for transaction | Check token balance and top up wallet |
| Invalid Private Key | Wallet authentication failed | Verify private key format and permissions |
| Network Timeout | RPC endpoint not responding | Switch to different RPC URL or retry |
| Contract Not Found | Asset or contract doesn't exist | Verify contract address and network |
| Transaction Failed | Blockchain transaction reverted | Check gas limits and contract state |
| Metadata Invalid | Asset metadata doesn't meet schema | Validate metadata against Ocean Protocol standards |

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
- **Ocean Discord**: [Ocean Protocol Community](https://discord.gg/TnXjkR5)