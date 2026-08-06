import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const PAGE_SIZE = 10;

export default function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (pageNo) => {
    setLoading(true);

    try {
      const skip = (pageNo - 1) * PAGE_SIZE;

      const response = await fetch(
        `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`
      );

      const json = await response.json();

      setProducts(json.products);
      setTotalPages(Math.ceil(json.total / PAGE_SIZE));
      setPage(pageNo);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
      />

      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>

      <Text style={styles.price}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      <View style={styles.pagination}>

        <TouchableOpacity
          disabled={page === 1}
          onPress={() => fetchProducts(page - 1)}
        >
          <Text style={styles.nav}>Prev</Text>
        </TouchableOpacity>

        {Array.from({ length: totalPages }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              page === index + 1 && styles.activeButton,
            ]}
            onPress={() => fetchProducts(index + 1)}
          >
            <Text
              style={{
                color: page === index + 1 ? '#fff' : '#000',
              }}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => fetchProducts(page + 1)}
        >
          <Text style={styles.nav}>Next</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },

  card: {
    flexDirection: 'row',
    padding: 10,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },

  image: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },

  title: {
    flex: 1,
    fontWeight: 'bold',
  },

  price: {
    color: 'green',
    fontWeight: 'bold',
  },

  pagination: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
    backgroundColor: 'blue',
  },

  nav: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: 'blue',
  },
});