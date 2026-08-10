import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
  Button,
} from 'react-native';

const ITEMS_PER_PAGE = 8;

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);

      const response = await fetch('https://dummyjson.com/products');
      const json = await response.json();

      setData(json.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    return data.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);


  // Reset page on search
  const onSearch = text => {
    setSearchText(text);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>

        <Text numberOfLines={2}>
          {item.description}
        </Text>

        <Text style={styles.price}>
          ${item.price}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Product..."
        value={searchText}
        onChangeText={onSearch}
        style={styles.search}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="blue"
        />
      ) : (
        <>
          <FlatList
            data={paginatedData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No Products Found
              </Text>
            }
          />
          {totalPages > 1 && (
            <View style={styles.pagination}>
              {/* Previous */}
              <View style={styles.button}>
                <Button
                  title="Prev"
                  onPress={() =>
                    setCurrentPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                />
              </View>

              {/* Page Buttons */}
              {pages.map(page => (
                <View
                  key={page}
                  style={styles.button}
                >
                  <Button
                    title={page.toString()}
                    color={
                      currentPage === page
                        ? '#007AFF'
                        : '#888'
                    }
                    onPress={() =>
                      setCurrentPage(page)
                    }
                  />
                </View>
              ))}

              {/* Next */}
              <View style={styles.button}>
                <Button
                  title="Next"
                  onPress={() =>
                    setCurrentPage(currentPage + 1)
                  }
                  disabled={
                    currentPage === totalPages
                  }
                />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
    backgroundColor: '#f2f2f2',
  },

  search: {
    height: 45,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  price: {
    marginTop: 5,
    color: 'green',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 30,
  },

  pagination: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  button: {
    margin: 4,
    minWidth: 60,
  },

  info: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});