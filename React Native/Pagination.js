import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const PAGE_SIZE = 16;

export default function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);

      const skip = (page - 1) * PAGE_SIZE;

      const response = await fetch(
        `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
      );

      const json = await response.json();

      setProducts(json.products);
      setTotalPages(Math.ceil(json.total / PAGE_SIZE));
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.image}
        />

        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {item.title}
        </Text>

        <Text style={styles.price}>
          ${item.price}
        </Text>
      </View>
    );
  };

  const renderPageButton = (page) => (
    <TouchableOpacity
      key={page}
      style={[
        styles.pageButton,
        currentPage === page && styles.activeButton,
      ]}
      onPress={() => fetchProducts(page)}
    >
      <Text
        style={[
          styles.pageText,
          currentPage === page && styles.activeText,
        ]}
      >
        {page}
      </Text>
    </TouchableOpacity>
  );

  if (loading && products.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={products}
        numColumns={4}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ padding: 10 }}
      />

      {loading && (
        <ActivityIndicator
          style={{ marginBottom: 10 }}
          size="small"
        />
      )}

      <View style={styles.pagination}>

        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => fetchProducts(currentPage - 1)}
        >
          <Text
            style={[
              styles.navButton,
              currentPage === 1 && { color: '#aaa' },
            ]}
          >
            ◀ Prev
          </Text>
        </TouchableOpacity>

        {Array.from(
          { length: totalPages },
          (_, index) => renderPageButton(index + 1)
        )}

        <TouchableOpacity
          disabled={currentPage === totalPages}
          onPress={() => fetchProducts(currentPage + 1)}
        >
          <Text
            style={[
              styles.navButton,
              currentPage === totalPages && { color: '#aaa' },
            ]}
          >
            Next ▶
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  card: {
    width: '23%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },

  title: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    height: 35,
  },

  price: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 14,
  },

  pagination: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  pageButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },

  activeButton: {
    backgroundColor: '#007AFF',
  },

  pageText: {
    color: '#000',
    fontWeight: 'bold',
  },

  activeText: {
    color: '#fff',
  },

  navButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#007AFF',
  },
});