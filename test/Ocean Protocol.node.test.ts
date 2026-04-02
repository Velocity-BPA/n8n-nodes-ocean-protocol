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

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
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
describe('Asset Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  test('createAsset operation success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createAsset')
      .mockReturnValueOnce('did:op:test123')
      .mockReturnValueOnce({ name: 'Test Asset', description: 'Test Description' })
      .mockReturnValueOnce([{ type: 'access' }]);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true, did: 'did:op:test123' });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      body: {
        did: 'did:op:test123',
        metadata: { name: 'Test Asset', description: 'Test Description' },
        services: [{ type: 'access' }]
      },
      json: true
    });

    expect(result).toEqual([{
      json: { success: true, did: 'did:op:test123' },
      pairedItem: { item: 0 }
    }]);
  });

  test('getAsset operation success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAsset')
      .mockReturnValueOnce('did:op:test123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ did: 'did:op:test123', metadata: {} });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets/ddo/did:op:test123',
      headers: {
        'Authorization': 'Bearer test-key'
      },
      json: true
    });

    expect(result).toEqual([{
      json: { did: 'did:op:test123', metadata: {} },
      pairedItem: { item: 0 }
    }]);
  });

  test('getAllAssets operation success', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllAssets')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('created')
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ assets: [], totalCount: 0 });

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/assets?page=1&offset=0&sort=created&asc=true',
      headers: {
        'Authorization': 'Bearer test-key'
      },
      json: true
    });

    expect(result).toEqual([{
      json: { assets: [], totalCount: 0 },
      pairedItem: { item: 0 }
    }]);
  });

  test('error handling', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAsset');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAssetOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Datatoken Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://v4.aquarius.oceanprotocol.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should create datatoken successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createDatatoken')
			.mockReturnValueOnce('Test Datatoken')
			.mockReturnValueOnce('TDT')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce('0x1234567890abcdef')
			.mockReturnValueOnce('1000000');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			address: '0xabcdef1234567890',
		});

		const items = [{ json: {} }];
		const result = await executeDatatokenOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.success).toBe(true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/datatokens',
			}),
		);
	});

	test('should get datatoken successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDatatoken')
			.mockReturnValueOnce('0xabcdef1234567890');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			address: '0xabcdef1234567890',
			name: 'Test Datatoken',
			symbol: 'TDT',
		});

		const items = [{ json: {} }];
		const result = await executeDatatokenOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.address).toBe('0xabcdef1234567890');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/datatokens/0xabcdef1234567890',
			}),
		);
	});

	test('should handle errors when continuing on fail', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getDatatoken');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const items = [{ json: {} }];
		const result = await executeDatatokenOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	test('should throw error when not continuing on fail', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getDatatoken');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const items = [{ json: {} }];

		await expect(
			executeDatatokenOperations.call(mockExecuteFunctions, items),
		).rejects.toThrow('API Error');
	});
});

describe('ComputeJob Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	it('should create compute job successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createComputeJob')
			.mockReturnValueOnce('test-signature')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('test-job-id')
			.mockReturnValueOnce({});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jobId: 'test-job-id',
			status: 'started',
		});

		const result = await executeComputeJobOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty('jobId', 'test-job-id');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute',
			}),
		);
	});

	it('should get compute job successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getComputeJob')
			.mockReturnValueOnce('test-signature')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('test-job-id');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jobId: 'test-job-id',
			status: 'running',
			progress: 50,
		});

		const result = await executeComputeJobOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty('status', 'running');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/api/services/compute'),
			}),
		);
	});

	it('should get all compute jobs successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllComputeJobs')
			.mockReturnValueOnce('test-signature')
			.mockReturnValueOnce('0x123456789');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
			{ jobId: 'job1', status: 'completed' },
			{ jobId: 'job2', status: 'running' },
		]);

		const result = await executeComputeJobOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveLength(2);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/api/services/compute'),
			}),
		);
	});

	it('should update compute job successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateComputeJob')
			.mockReturnValueOnce('test-signature')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('test-job-id')
			.mockReturnValueOnce('stop');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			jobId: 'test-job-id',
			status: 'stopped',
		});

		const result = await executeComputeJobOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty('status', 'stopped');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'PUT',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute',
			}),
		);
	});

	it('should delete compute job successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteComputeJob')
			.mockReturnValueOnce('test-signature')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('test-job-id');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			success: true,
			message: 'Compute job deleted successfully',
		});

		const result = await executeComputeJobOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty('success', true);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'DELETE',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/compute',
			}),
		);
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createComputeJob')
			.mockReturnValueOnce('test-signature');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		await expect(
			executeComputeJobOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});

	it('should handle errors with continueOnFail', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createComputeJob')
			.mockReturnValueOnce('test-signature');

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('API Error'),
		);

		const result = await executeComputeJobOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json).toHaveProperty('error', 'API Error');
	});
});

describe('VeOcean Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v4.aquarius.oceanprotocol.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  describe('getVeOceanLocks', () => {
    it('should get veOCEAN locks successfully', async () => {
      const mockResponse = {
        locks: [
          {
            amount: '1000000000000000000',
            unlockTime: 1234567890,
            lockId: 'lock_123'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getVeOceanLocks')
        .mockReturnValueOnce('0x123...abc')
        .mockReturnValueOnce('1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v4.aquarius.oceanprotocol.com/api/aquarius/veocean/locks/0x123...abc',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json'
        },
        qs: { chainId: '1' },
        json: true
      });
    });

    it('should handle errors when getting veOCEAN locks', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getVeOceanLocks');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeVeOceanOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('createVeOceanLock', () => {
    it('should create veOCEAN lock successfully', async () => {
      const mockResponse = {
        success: true,
        lockId: 'lock_456',
        transactionHash: '0xabc123'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createVeOceanLock')
        .mockReturnValueOnce('1000000000000000000')
        .mockReturnValueOnce('2024-12-31T23:59:59Z')
        .mockReturnValueOnce('0x123...abc');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getVeOceanRewards', () => {
    it('should get veOCEAN rewards successfully', async () => {
      const mockResponse = {
        totalRewards: '500000000000000000',
        claimableRewards: '200000000000000000',
        pendingRewards: '300000000000000000'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getVeOceanRewards')
        .mockReturnValueOnce('0x123...abc')
        .mockReturnValueOnce('1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('claimVeOceanRewards', () => {
    it('should claim veOCEAN rewards successfully', async () => {
      const mockResponse = {
        success: true,
        claimedAmount: '200000000000000000',
        transactionHash: '0xdef456'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('claimVeOceanRewards')
        .mockReturnValueOnce('0x123...abc')
        .mockReturnValueOnce('100000000000000000,100000000000000000')
        .mockReturnValueOnce('1');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getAllVeOceanAllocations', () => {
    it('should get all veOCEAN allocations successfully', async () => {
      const mockResponse = {
        allocations: [
          {
            user: '0x123...abc',
            allocation: '1000000000000000000',
            epoch: 123
          }
        ],
        totalAllocated: '5000000000000000000'
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllVeOceanAllocations')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVeOceanOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Order Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://v4.aquarius.oceanprotocol.com'
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

	it('should create order successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createOrder')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('signature-data');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			orderId: 'order-123',
			status: 'pending',
		});

		const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://v4.aquarius.oceanprotocol.com/api/services/order',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
			body: {
				documentId: 'test-document-id',
				serviceId: 'test-service-id',
				consumerAddress: '0x123456789',
				signature: 'signature-data',
			},
		});

		expect(result).toEqual([{
			json: { orderId: 'order-123', status: 'pending' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get order by transaction ID successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getOrder')
			.mockReturnValueOnce('tx-12345');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			txId: 'tx-12345',
			status: 'completed',
		});

		const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://v4.aquarius.oceanprotocol.com/api/services/order/tx-12345',
			headers: {
				'Authorization': 'Bearer test-key',
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { txId: 'tx-12345', status: 'completed' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should get all orders for consumer successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllOrders')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce(1)
			.mockReturnValueOnce(0);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			orders: [{ orderId: 'order-1' }, { orderId: 'order-2' }],
			total: 2,
		});

		const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://v4.aquarius.oceanprotocol.com/api/services/orders/0x123456789',
			headers: {
				'Authorization': 'Bearer test-key',
			},
			qs: {
				page: 1,
				offset: 0,
			},
			json: true,
		});

		expect(result).toEqual([{
			json: { orders: [{ orderId: 'order-1' }, { orderId: 'order-2' }], total: 2 },
			pairedItem: { item: 0 },
		}]);
	});

	it('should download asset successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('downloadAsset')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('signature-data');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			downloadUrl: 'https://download-url.com/file',
		});

		const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://v4.aquarius.oceanprotocol.com/api/services/download',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
			body: {
				documentId: 'test-document-id',
				serviceId: 'test-service-id',
				fileIndex: 0,
				signature: 'signature-data',
			},
		});

		expect(result).toEqual([{
			json: { downloadUrl: 'https://download-url.com/file' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should initialize asset successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('initializeAsset')
			.mockReturnValueOnce('test-document-id')
			.mockReturnValueOnce('test-service-id')
			.mockReturnValueOnce('signature-data')
			.mockReturnValueOnce('0x123456789');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			initialized: true,
			serviceEndpoint: 'https://service-endpoint.com',
		});

		const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://v4.aquarius.oceanprotocol.com/api/services/initialize',
			headers: {
				'Authorization': 'Bearer test-key',
				'Content-Type': 'application/json',
			},
			json: true,
			body: {
				documentId: 'test-document-id',
				serviceId: 'test-service-id',
				signature: 'signature-data',
				consumerAddress: '0x123456789',
			},
		});

		expect(result).toEqual([{
			json: { initialized: true, serviceEndpoint: 'https://service-endpoint.com' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should handle API errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createOrder');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]))
			.rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Provider Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	describe('getProvider operation', () => {
		it('should get provider service information successfully', async () => {
			const mockResponse = { status: 'active', version: '1.0.0' };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getProvider');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/provider',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle getProvider error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getProvider');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeProviderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('encryptData operation', () => {
		it('should encrypt data successfully', async () => {
			const mockResponse = { encryptedData: 'encrypted_content', hash: 'data_hash' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('encryptData')
				.mockReturnValueOnce('doc123')
				.mockReturnValueOnce('signature123')
				.mockReturnValueOnce({ content: 'test data' });
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/encrypt',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					documentId: 'doc123',
					signature: 'signature123',
					document: { content: 'test data' },
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getFileInfo operation', () => {
		it('should get file information successfully', async () => {
			const mockResponse = { fileSize: 1024, contentType: 'application/json' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFileInfo')
				.mockReturnValueOnce('did:op:123')
				.mockReturnValueOnce('service1')
				.mockReturnValueOnce('signature123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/fileinfo',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					did: 'did:op:123',
					serviceId: 'service1',
					signature: 'signature123',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getNonce operation', () => {
		it('should get nonce successfully', async () => {
			const mockResponse = { nonce: 'abc123' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getNonce')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/nonce',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				qs: {
					userAddress: '0x1234567890123456789012345678901234567890',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('validateAsset operation', () => {
		it('should validate asset successfully', async () => {
			const mockResponse = { valid: true, accessible: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('validateAsset')
				.mockReturnValueOnce('did:op:123')
				.mockReturnValueOnce('signature123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProviderOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://v4.aquarius.oceanprotocol.com/api/services/validate',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					did: 'did:op:123',
					signature: 'signature123',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});
});
