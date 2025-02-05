import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { General } from '../constants';
import { Seperator } from '../components';

const PantryPro = () => {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const [editItem, setEditItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const initialFormState = {
    name: '',
    quantity: '',
    category: '',
    expires: '',
    status: 'fresh',
  };

  const [newItem, setNewItem] = useState(initialFormState);

  const categories = [
    "Fruits & Vegetables", 
    "Dairy & Eggs", 
    "Grains & Cereals",
     "Meat & Fish", 
     "Packaged Foods", 
     "Beverages",
     "Condiments & Spices",
    "Others"
  ];

  const determineItemStatus = (expiryDate) => {
    if (!expiryDate) return 'fresh';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    if (expiry < today) return 'expired';
    if (expiry <= threeDaysFromNow) return 'warning';
    return 'fresh';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'fresh': return '#4CAF50';
      case 'warning': return '#FFC107';
      case 'expired': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchItems();
    }
  }, [user, isLoaded]);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${General.API_BASE_URL}api/items?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const updatedInventory = data.map(item => ({
          ...item,
          status: determineItemStatus(item.expires)
        }));
        setInventory(updatedInventory);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.quantity && newItem.category && newItem.expires) {
      const status = determineItemStatus(newItem.expires);
      const payload = {
        ...newItem,
        status,
        userId: user.id,
      };

      const url = editItem 
        ? `${General.API_BASE_URL}api/items/${editItem._id}`
        : `${General.API_BASE_URL}api/items/`;
      
      try {
        const response = await fetch(url, {
          method: editItem ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (editItem) {
            setInventory(prev => prev.map(item => 
              item._id === data.item._id ? data.item : item
            ));
          } else {
            setInventory(prev => [...prev, data.item]);
          }
          resetForm();
        }
      } catch (error) {
        console.error('Error saving item:', error);
      }
    }
  };

// When editing an item, properly set all form fields
useEffect(() => {
  if (editItem) {
    setNewItem({
      name: editItem.name || '',
      quantity: editItem.quantity ? editItem.quantity.toString() : '',
      category: editItem.category || '',
      expires: editItem.expires || '',
      status: editItem.status || 'fresh',
    });
  }
}, [editItem]);

const resetForm = () => {
  setNewItem(initialFormState);
  setEditItem(null);
  setShowAddForm(false);
  setShowDatePicker(false);
};


  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(
        `${General.API_BASE_URL}api/items/${id}?userId=${user.id}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        setInventory(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderAddForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        {editItem ? 'Edit Item' : 'Add New Item'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newItem.name}
        onChangeText={text => setNewItem(prev => ({ ...prev, name: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={newItem.quantity}
        onChangeText={text => setNewItem(prev => ({ ...prev, quantity: text }))}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={newItem.category}
          onValueChange={value => setNewItem(prev => ({ ...prev, category: value }))}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map(category => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {newItem.expires || 'Select Expiry Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
  <DateTimePicker
    value={newItem.expires ? new Date(newItem.expires) : new Date()}
    mode="date"
    display={Platform.OS === 'ios' ? 'inline' : 'default'}
    onChange={(event, selectedDate) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false); // Close picker immediately on Android
      }
      if (selectedDate) {
        setNewItem(prev => ({
          ...prev,
          expires: selectedDate.toISOString().split('T')[0],
        }));
      }
    }}
  />
)}


      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleAddItem}
      >
        <Text style={styles.saveButtonText}>
          {editItem ? 'Update Item' : 'Save Item'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={resetForm}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );


  const renderInventoryItem = (item) => (
    <View 
      style={[
        styles.itemCard,
        { borderColor: getStatusColor(item.status) }
      ]}
      key={item._id}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemDetails}>{item.status === "expired" ? "Expired" : `Expiry Date: ${new Date(item.expires).toLocaleDateString('en-GB')}`}</Text>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          onPress={() => {
            setEditItem(item);
            setNewItem(item);
            setShowAddForm(true);
          }}
        >
          <Icon name="edit" size={24} color="#2196F3" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleDeleteItem(item._id)}
        >
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleDeleteItem(item._id)}
        >
          <Icon name="check-circle-outline" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
            <Seperator height={StatusBar.currentHeight}/>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pantry Pro</Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          <Icon name={showAddForm ? "close" : "add"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showAddForm && renderAddForm()}

        <View style={styles.inventoryContainer}>
          {categories.map(category => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setExpandedCategory(
                  expandedCategory === category ? null : category
                )}
              >
                <Text style={styles.categoryTitle}>{category}</Text>
                <Icon 
                  name={expandedCategory === category ? "expand-less" : "expand-more"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>

              {expandedCategory === category && (
                <View style={styles.categoryContent}>
                  {inventory
                    .filter(item => item.category === category)
                    .map(renderInventoryItem)}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inventoryContainer: {
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
 
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FF6B6B',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
 
 
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryContent: {
    paddingTop: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDetails: {
    color: '#666',
    marginBottom: 4,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default PantryPro;