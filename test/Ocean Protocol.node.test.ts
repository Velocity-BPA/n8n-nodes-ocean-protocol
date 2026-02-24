/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { OceanProtocol } from '../nodes/Ocean Protocol/Ocean Protocol.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('OceanProtocol Node', () => {
  let node: OceanProtocol;

  beforeAll(() => {
    node = new OceanProtocol();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Ocean Protocol');
      expect(node.description.name).toBe('oceanprotocol');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('DataNFTs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should create a Data NFT successfully', async () => {
    const mockResponse = { id: 'did:op:12345', created: true };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createDataNFT';
        case 'metadata': return { name: 'Test NFT', description: 'Test Description' };
        case 'services': return [{ type: 'access', url: 'https://example.com' }];
        case 'credentials': return { wallet: '0x123' };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        metadata: { name: 'Test NFT', description: 'Test Description' },
        services: [{ type: 'access', url: 'https://example.com' }],
        credentials: { wallet: '0x123' },
      },
      json: true,
    });
  });

  it('should get a Data NFT successfully', async () => {
    const mockResponse = { id: 'did:op:12345', metadata: { name: 'Test NFT' } };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getDataNFT';
        case 'did': return 'did:op:12345';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:12345',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  it('should search Data NFTs successfully', async () => {
    const mockResponse = { results: [], totalResults: 0 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'searchDataNFTs';
        case 'query': return { text: 'ocean' };
        case 'offset': return 0;
        case 'size': return 25;
        case 'sort': return { created: 'desc' };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/query',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      qs: {
        query: '{"text":"ocean"}',
        offset: 0,
        size: 25,
        sort: '{"created":"desc"}',
      },
      json: true,
    });
  });

  it('should update a Data NFT successfully', async () => {
    const mockResponse = { id: 'did:op:12345', updated: true };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateDataNFT';
        case 'did': return 'did:op:12345';
        case 'metadata': return { name: 'Updated NFT' };
        case 'credentials': return { wallet: '0x123' };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should delete a Data NFT successfully', async () => {
    const mockResponse = { deleted: true };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'deleteDataNFT';
        case 'did': return 'did:op:12345';
        case 'credentials': return { wallet: '0x123' };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle API errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getDataNFT';
        case 'did': return 'invalid-did';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects
      .toThrow();
  });

  it('should handle unknown operations', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(executeDataNFTsOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});

describe('Datatokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should create datatoken successfully', async () => {
    const mockResponse = { id: 'did:op:123', datatoken: '0x123abc' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createDatatoken';
        case 'dataTokenOptions': return { name: 'Test Token', symbol: 'TT' };
        case 'fixedPriceOptions': return { price: '1.0' };
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDatatokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        dataTokenOptions: { name: 'Test Token', symbol: 'TT' },
        fixedPriceOptions: { price: '1.0' },
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should get datatoken by DID successfully', async () => {
    const mockResponse = { id: 'did:op:123', services: [] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getDatatoken';
        case 'did': return 'did:op:123';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDatatokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did%3Aop%3A123',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should search datatokens successfully', async () => {
    const mockResponse = { results: [], totalResults: 0 };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'searchDatatokens';
        case 'query': return { text: 'ocean data' };
        case 'dataTokenAddress': return '0x123abc';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDatatokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/query',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      qs: {
        query: { text: 'ocean data' },
        dataTokenAddress: '0x123abc',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should purchase datatoken successfully', async () => {
    const mockResponse = { orderId: 'order-123', transactionHash: '0xabc123' };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'purchaseDatatoken';
        case 'did': return 'did:op:123';
        case 'consumerAddress': return '0x456def';
        case 'serviceIndex': return 0;
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDatatokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did%3Aop%3A123/order',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        consumerAddress: '0x456def',
        serviceIndex: 0,
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should get compute environments successfully', async () => {
    const mockResponse = { environments: [] };
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getComputeEnvironments';
        case 'did': return 'did:op:123';
        default: return undefined;
      }
    });
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDatatokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did%3Aop%3A123/computeEnvironments',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDatatoken';
      if (param === 'did') return 'invalid-did';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeDatatokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('ComputeToData Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should start a compute job successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'startComputeJob';
        case 'dataset': return 'did:op:dataset123';
        case 'algorithm': return 'did:op:algorithm456';
        case 'compute': return '{"type":"kubernetes","namespace":"ocean-compute"}';
        case 'consumerAddress': return '0x1234567890abcdef';
        default: return '';
      }
    });

    const mockResponse = {
      jobId: 'job-123',
      status: 'started',
      dataset: 'did:op:dataset123',
      algorithm: 'did:op:algorithm456',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        dataset: 'did:op:dataset123',
        algorithm: 'did:op:algorithm456',
        compute: { type: 'kubernetes', namespace: 'ocean-compute' },
        consumerAddress: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should get compute jobs successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getComputeJobs';
        case 'consumerAddress': return '0x1234567890abcdef';
        case 'jobId': return '';
        default: return '';
      }
    });

    const mockResponse = [
      { jobId: 'job-123', status: 'running' },
      { jobId: 'job-456', status: 'completed' },
    ];

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute',
      qs: {
        consumerAddress: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should get specific compute job successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getComputeJob';
        case 'jobId': return 'job-123';
        case 'consumerAddress': return '0x1234567890abcdef';
        default: return '';
      }
    });

    const mockResponse = {
      jobId: 'job-123',
      status: 'running',
      dataset: 'did:op:dataset123',
      algorithm: 'did:op:algorithm456',
      startedAt: '2023-01-01T00:00:00Z',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute/job-123',
      qs: {
        consumerAddress: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should stop compute job successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'stopComputeJob';
        case 'jobId': return 'job-123';
        case 'consumerAddress': return '0x1234567890abcdef';
        default: return '';
      }
    });

    const mockResponse = {
      jobId: 'job-123',
      status: 'stopped',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute/job-123',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        consumerAddress: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should delete compute job successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'deleteComputeJob';
        case 'jobId': return 'job-123';
        case 'consumerAddress': return '0x1234567890abcdef';
        default: return '';
      }
    });

    const mockResponse = {
      jobId: 'job-123',
      status: 'deleted',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute/job-123',
      qs: {
        consumerAddress: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should get compute results successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getComputeResults';
        case 'jobId': return 'job-123';
        case 'consumerAddress': return '0x1234567890abcdef';
        case 'index': return 0;
        default: return '';
      }
    });

    const mockResponse = Buffer.from('result data');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute/job-123/output',
      qs: {
        consumerAddress: '0x1234567890abcdef',
        index: 0,
      },
      encoding: null,
      json: false,
    });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getComputeJob';
        case 'jobId': return 'invalid-job';
        case 'consumerAddress': return '0x1234567890abcdef';
        default: return '';
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Job not found'));

    const result = await executeComputeToDataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Job not found' });
  });
});

describe('VeOcean Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getVeOceanStats', () => {
    it('should successfully get veOCEAN statistics', async () => {
      const mockResponse = {
        totalVeOcean: '1000000',
        totalAllocations: '500000',
        stats: {},
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getVeOceanStats';
          case 'query': return 'test query';
          case 'veAllocate': return true;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/query',
        qs: {
          query: 'test query',
          veAllocate: true,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when getting veOCEAN statistics', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getVeOceanStats';
          case 'query': return 'test query';
          default: return undefined;
        }
      });

      const mockError = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(executeVeOceanOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('API Error');
    });
  });

  describe('allocateVeOcean', () => {
    it('should successfully allocate veOCEAN', async () => {
      const mockResponse = {
        transactionId: '0x123',
        status: 'success',
      };

      const allocationData = { amount: '1000', assetId: 'did:op:123' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'allocateVeOcean';
          case 'allocation': return JSON.stringify(allocationData);
          case 'userData': return '{}';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          allocation: allocationData,
          userData: {},
        },
        json: true,
      });
    });
  });

  describe('getVeOceanAllocations', () => {
    it('should successfully get veOCEAN allocations', async () => {
      const mockResponse = {
        did: 'did:op:123',
        allocations: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getVeOceanAllocations';
          case 'did': return 'did:op:123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getRewards', () => {
    it('should successfully get rewards information', async () => {
      const mockResponse = {
        rewards: [],
        totalRewards: '5000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getRewards';
          case 'chainIds': return '1,137';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('claimRewards', () => {
    it('should successfully claim rewards', async () => {
      const mockResponse = {
        transactionId: '0x456',
        claimedAmount: '100',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'claimRewards';
          case 'did': return 'did:op:123';
          case 'consumerAddress': return '0xConsumerAddress123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:123/order',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          consumerAddress: '0xConsumerAddress123',
        },
        json: true,
      });
    });
  });
});

describe('AssetMetadata Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getMetadata operation', () => {
    it('should retrieve asset metadata by DID successfully', async () => {
      const mockResponse = {
        '@context': ['https://w3id.org/did/v1'],
        id: 'did:op:test123',
        name: 'Test Asset',
        description: 'A test asset'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getMetadata';
        if (param === 'did') return 'did:op:test123';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/metadata/did:op:test123',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('searchMetadata operation', () => {
    it('should search metadata with filters successfully', async () => {
      const mockResponse = {
        results: [
          { id: 'did:op:test1', name: 'Asset 1' },
          { id: 'did:op:test2', name: 'Asset 2' }
        ],
        totalResults: 2
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'searchMetadata';
        if (param === 'query') return '{"query": {"match_all": {}}}';
        if (param === 'filters') return '{"chainId": 1}';
        if (param === 'sort') return '{"created": "desc"}';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('validateAssetName operation', () => {
    it('should validate asset name availability successfully', async () => {
      const mockResponse = {
        available: true,
        name: 'test-asset-name'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'validateAssetName';
        if (param === 'name') return 'test-asset-name';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/names',
        headers: {
          'Content-Type': 'application/json',
        },
        qs: {
          name: 'test-asset-name',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getSupportedChains operation', () => {
    it('should get supported chains successfully', async () => {
      const mockResponse = [
        { chainId: 1, name: 'Ethereum Mainnet' },
        { chainId: 137, name: 'Polygon' }
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSupportedChains';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getProtocolStats operation', () => {
    it('should get protocol statistics successfully', async () => {
      const mockResponse = {
        totalAssets: 1000,
        totalTransactions: 5000,
        totalVolume: '100000'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getProtocolStats';
        if (param === 'chainIds') return '1,137';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      const error = new Error('API Error');
      (error as any).httpCode = 404;

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getMetadata';
        if (param === 'did') return 'invalid-did';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow('API Error');
    });

    it('should continue on fail when configured', async () => {
      const error = new Error('API Error');
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getMetadata';
        if (param === 'did') return 'invalid-did';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeAssetMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: {
          error: 'API Error',
          operation: 'getMetadata',
          item: 0
        },
        pairedItem: { item: 0 }
      }]);
    });
  });
});
});
