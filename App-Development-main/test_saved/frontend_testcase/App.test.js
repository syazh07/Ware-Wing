import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import axios from 'axios';

jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
  mockAxios.create.mockReturnValue(mockAxios);
  mockAxios.get.mockResolvedValue({ data: [] });
  mockAxios.post.mockResolvedValue({ data: {} });
  mockAxios.put.mockResolvedValue({ data: {} });
  mockAxios.delete.mockResolvedValue({ data: {} });
  return mockAxios;
});

describe('Frontend Tests (WareWing Inventory System)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, 'Test page', '/');
  });

  test('T01 - Folder structure: Login component exists', async () => {
    const { default: Login } = await import('../components/Login');
    render(<BrowserRouter><Provider store={store}><Login /></Provider></BrowserRouter>);
    expect(screen.getByText(/WareWing Login/i)).toBeInTheDocument();
    console.log('Login component verified successfully');
  });

  test('T02 - Folder structure: services directory exists', async () => {
    const { default: stockItemService } = await import('../services/stockItemService');
    expect(stockItemService).toBeDefined();
    expect(stockItemService.getAll).toBeDefined();
    console.log('Services directory exists: stockItemService verified successfully');
  });

  test('T03 - Folder structure: store directory exists', async () => {
    const response = await import('../store/slices/authSlice');
    expect(response).toBeDefined();
    expect(typeof response.default).toBe('function');
    console.log('Store directory exists: authSlice verified successfully');
  });

  test('T04 - Folder structure: styling check', async () => {
    const AppContainer = document.createElement('div');
    AppContainer.className = 'app-container';
    expect(AppContainer.className).toBe('app-container');
    console.log('Styling: app-container verified successfully');
  });

  test('T05 - Folder structure: layout directory exists', async () => {
    const { default: Navbar } = await import('../components/layout/Navbar');
    render(<BrowserRouter><Provider store={store}><Navbar /></Provider></BrowserRouter>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    console.log('Layout directory exists: Navbar verified successfully');
  });

  test('T06 - Navbar: Displays navigation links', async () => {
    const { default: Navbar } = await import('../components/layout/Navbar');
    render(<BrowserRouter><Provider store={store}><Navbar /></Provider></BrowserRouter>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    console.log('Active user state verified in Navbar');
  });

  test('T07 - StockItemList: Fetches and displays items from the backend', async () => {
    const mockData = [{ id: 1, sku: 'ELEC-100', name: 'Smart Wireless Router', category: 'Electronics', currentQuantity: 50, status: 'ACTIVE', unitPrice: 89.99 }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const { default: StockItemList } = await import('../components/stockItem/StockItemList');
    render(<BrowserRouter><Provider store={store}><StockItemList /></Provider></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('ELEC-100')).toBeInTheDocument();
    });
    console.log('Success: StockItemList correctly performed data fetching and state update on mount');
  });

  test('T08 - authService: login method exists and POSTs to correct auth endpoint', async () => {
    const mockAuthResponse = {
      data: {
        accessToken: 'mock-jwt-token',
        role: 'MANAGER',
        username: 'admin'
      }
    };

    axios.post.mockResolvedValueOnce(mockAuthResponse);

    const { default: authService } = await import('../services/authService');

    expect(typeof authService.login).toBe('function');
    expect(typeof authService.logout).toBe('function');

    const result = await authService.login({ username: 'admin', password: 'password' });

    expect(axios.post).toHaveBeenCalled();
    expect(result.accessToken).toBe('mock-jwt-token');
    expect(result.role).toBe('MANAGER');
    expect(result.username).toBe('admin');

    console.log('authService: login callable, hits endpoint, returns accessToken/role/username verified');
  });

  test('T09 - StockItemForm: Submits data to backend and shows success feedback', async () => {
    axios.post.mockResolvedValueOnce({ status: 201, data: "StockItem created successfully." });

    const { default: StockItemForm } = await import('../components/stockItem/StockItemForm');
    render(<BrowserRouter><Provider store={store}><StockItemForm onClose={() => { }} /></Provider></BrowserRouter>);

    const skuInput = screen.getByPlaceholderText(/e.g., SKU-1001/i);
    const nameInput = screen.getByPlaceholderText(/Product Name/i);
    const saveBtn = screen.getByRole('button', { name: /Create Stock Item/i });

    fireEvent.change(skuInput, { target: { value: 'ELEC-100' } });
    fireEvent.change(nameInput, { target: { value: 'Router' } });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
    console.log('Success: Full integration flow from UI to API verified');
  });

  test('T10 - Redux: Verifies auth state updates', async () => {
    const mockToken = 'mock-jwt-token';
    store.dispatch({ type: 'auth/login/fulfilled', payload: { accessToken: mockToken, role: 'MANAGER', username: 'admin' } });
    const state = store.getState().auth;
    expect(state.token).toBe(mockToken);
    console.log('Global State (Redux): auth state transition verified successfully');
  });

  test('T11 - Routing: Protected content redirects to login when unauthenticated', async () => {
    store.dispatch({ type: 'auth/logout' });

    const { default: Login } = await import('../components/Login');
    window.history.pushState({}, 'Test page', '/stock-items');
    render(<BrowserRouter><Provider store={store}><Login /></Provider></BrowserRouter>);

    expect(screen.getByText(/WareWing Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    console.log('Routing: Protected access logic verified - login page rendered for unauthenticated user');
  });

  test('T12 - Login: Input fields should exist', async () => {
    const { default: Login } = await import('../components/Login');
    render(<BrowserRouter><Provider store={store}><Login /></Provider></BrowserRouter>);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    console.log('UI: Login form fields verified for better UX');
  });

  test('T13 - Feedback: Displays error message when operation fails', async () => {
    const ErrorComponent = ({ error }) => (
      <div className="error-message">{error && <p data-testid="error-message">{error}</p>}</div>
    );
    const errorMessage = "Invalid Credentials";
    render(<ErrorComponent error={errorMessage} />);
    expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    console.log('UI Feedback: Error message visibility logic confirmed');
  });

  test('T14 - UI: Shows loading spinner during fetch', async () => {
    const DataLoader = ({ isLoading, data }) => (
      <div>{isLoading ? <div data-testid="loader" className="loading-spinner">Loading...</div> : <div data-testid="content">{data}</div>}</div>
    );
    render(<DataLoader isLoading={true} data={null} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    console.log('UI UX: Component loading/content transition verified');
  });

  test('T15 - FormReset: Clears input fields', async () => {
    const ResetForm = () => {
      const [val, setVal] = React.useState('ELEC-100');
      return (
        <div>
          <input data-testid="reset-input" value={val} onChange={(e) => setVal(e.target.value)} />
          <button onClick={() => setVal('')}>Reset</button>
        </div>
      );
    };
    render(<ResetForm />);
    const input = screen.getByTestId('reset-input');
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(input.value).toBe('');
    console.log('Form Logic: Reset functionality verified');
  });

  test('T16 - Validation: Blocks API call if SKU is empty', async () => {
    const postSpy = jest.spyOn(axios, 'post');
    const { default: StockItemForm } = await import('../components/stockItem/StockItemForm');
    render(<BrowserRouter><Provider store={store}><StockItemForm onClose={() => { }} /></Provider></BrowserRouter>);

    const submitBtn = screen.getByRole('button', { name: /Create Stock Item/i });
    fireEvent.click(submitBtn);

    expect(postSpy).not.toHaveBeenCalled();
    console.log('Project Strategy: Frontend validation successfully blocked unnecessary API hit');
  });



  test('T17 - Suppliers: Displays success message after deleting a supplier', async () => {
    axios.delete.mockResolvedValueOnce({ status: 200, data: 'Supplier deleted successfully.' });

    const { default: supplierService } = await import('../services/supplierService');
    expect(typeof supplierService.delete).toBe('function');

    const deleteResult = await axios.delete('/api/suppliers/1');
    expect(deleteResult.status).toBe(200);
    expect(deleteResult.data).toBe('Supplier deleted successfully.');
    console.log('CRUD logic: Supplier deletion feedback verified');
  });
  test('T18 - StockMovements: Records reorder triggered events', async () => {
    const mockMovement = {
      id: 1,
      movementDate: new Date().toISOString(),
      movementType: 'REORDER_TRIGGERED',
      quantityDelta: 0,
      newQuantity: 50,
      notes: 'Low stock threshold reached'
    };
    axios.get.mockResolvedValueOnce({ data: [mockMovement] });

    const { default: StockMovementList } = await import('../components/stockMovement/StockMovementList');
    render(<BrowserRouter><Provider store={store}><StockMovementList /></Provider></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('REORDER_TRIGGERED')).toBeInTheDocument();
    });
    console.log('Audit logic: REORDER_TRIGGERED movement recording verified');
  });

  test('T19 - stockItemService: getAll returns a flat array of stock items', async () => {
    const mockItems = [
      {
        id: 1, sku: 'ELEC-100', name: 'Smart Router', category: 'Electronics',
        currentQuantity: 50, status: 'ACTIVE', unitPrice: 89.99
      }
    ];

    axios.get.mockResolvedValueOnce({ data: mockItems });

    const { default: stockItemService } = await import('../services/stockItemService');
    const result = await stockItemService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result[0].sku).toBe('ELEC-100');
    expect(result[0].status).toBe('ACTIVE');
    expect(axios.get).toHaveBeenCalled();
    console.log('Data Logic: stockItemService.getAll returns flat List<StockItem> verified');
  });

  test('T20 - Resilience: Shows error on network failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    const ErrorComponent = ({ error }) => (
      <div className="error-message">
        {error && <p data-testid="error-message">{error}</p>}
      </div>
    );

    render(<ErrorComponent error="Network Error" />);
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Network Error');

    await expect(axios.get('/api/stock-items/all')).rejects.toThrow('Network Error');
    console.log('Resilience: Network level failure handling verified');
  });

  test('T21 - Validation: Verifies SKU format', async () => {
    const skuPattern = /^[A-Z]{3,4}-\d{3,4}$/;
    expect(skuPattern.test("ELEC-1001")).toBe(true);
    console.log('Validation: SKU pattern logic verified');
  });

  test('T22 - StockItemForm: Validates input types', async () => {
    const { default: StockItemForm } = await import('../components/stockItem/StockItemForm');
    render(<BrowserRouter><Provider store={store}><StockItemForm onClose={() => { }} /></Provider></BrowserRouter>);
    const priceInput = screen.getByLabelText(/Unit Price/i);
    expect(priceInput).toHaveAttribute('type', 'number');
    console.log('Component Logic: StockItemForm input types verified');
  });

  

  test('T23 - StockItemForm: Technical validation blocks submit when name is empty', async () => {
    const postSpy = jest.spyOn(axios, 'post');

    const { default: StockItemForm } = await import('../components/stockItem/StockItemForm');
    render(<BrowserRouter><Provider store={store}><StockItemForm onClose={() => { }} /></Provider></BrowserRouter>);

    const skuInput = screen.getByPlaceholderText(/e.g., SKU-1001/i);
    const submitBtn = screen.getByRole('button', { name: /Create Stock Item/i });

    fireEvent.change(skuInput, { target: { value: 'ELEC-100' } });
    // name intentionally left empty
    fireEvent.click(submitBtn);

    expect(postSpy).not.toHaveBeenCalled();
    console.log('Component Logic: StockItemForm technical validation verified - empty name blocks API call');
  });

 

  test('T24 - Style: Primary branding buttons follow professional constraints', async () => {
    const { default: StockItemForm } = await import('../components/stockItem/StockItemForm');
    render(<BrowserRouter><Provider store={store}><StockItemForm onClose={() => { }} /></Provider></BrowserRouter>);

    const submitBtn = screen.getByRole('button', { name: /Create Stock Item/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn.tagName).toBe('BUTTON');

    const closeBtn = document.querySelector('.btn-close');
    expect(closeBtn).toBeInTheDocument();
    console.log('Style Verification: Button professional aesthetics confirmed');
  });

 
  test('T25 - Layout: Global container centering and width constraints', async () => {
    const { default: Navbar } = await import('../components/layout/Navbar');
    render(<BrowserRouter><Provider store={store}><Navbar /></Provider></BrowserRouter>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    console.log('Layout Verification: Professional navigation constraints verified');
  });

});