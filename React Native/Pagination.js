import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native'

export default function APP() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getdata()
  }, [])

  const getdata = async () => {
    setLoading(true)

    try {
      const response = await fetch('https://dummyjson.com/products')
      const json = await response.json()

      setData(json.products)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterdata = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  const pagedata = filterdata.slice(
    (page - 1) * 10,
    page * 10
  )

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.image}
        />

        <Text>{item.title}</Text>
        <Text>${item.price.toFixed(2)}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={(text) => {
          setSearch(text)
          setPage(1)
        }}
        placeholder="Search..."
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={pagedata}
            numColumns={4}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />

          <Text style={styles.page}>
            Page {page}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
           
            <Button
              title="Previous Page"
              disabled={page === 1}
              onPress={() => setPage((prev) => prev - 1)}
            />

             <Button
              title="Next Page"
              disabled={page * 10 >= filterdata.length}
              onPress={() => setPage((prev) => prev + 1)}
            />

          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },

  card: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 300,
    alignItems: 'center',
    minHeight: 200,
  },

  image: {
    width: 100,
    height: 100,
  },

  page: {
    textAlign: 'center',
    margin: 10,
  },
})
