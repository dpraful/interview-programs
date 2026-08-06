import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../src/App';

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        total: 30,
        products: [
          {
            id: 1,
            title: 'iPhone',
            price: 999,
            thumbnail: 'https://dummyjson.com/image.jpg',
          },
        ],
      }),
  })
);

describe('Pagination Screen', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders first page', async () => {
    const { findByText } = render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(await findByText('iPhone')).toBeTruthy();
  });

  test('calls API when page 2 is clicked', async () => {
    const { findByText } = render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const page2 = await findByText('2');

    fireEvent.press(page2);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('click next button', async () => {
    const { findByText } = render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const next = await findByText('Next');

    fireEvent.press(next);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  test('click previous button', async () => {
    const { findByText } = render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const next = await findByText('Next');
    fireEvent.press(next);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    const prev = await findByText('Prev');
    fireEvent.press(prev);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  test('API called initially', async () => {
    render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});