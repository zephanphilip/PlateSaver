import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Dimensions,
  Modal,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { General } from '../constants';
import { Seperator } from '../components';

const { width } = Dimensions.get('window');

const CartCompanion = ({ navigation }) => {
  const { user, isLoaded } = useUser();
  const [inventory, setInventory] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState("");
  const [selectedInventoryLabel, setSelectedInventoryLabel] = useState("Select from Inventory");
  const [updateTimers, setUpdateTimers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showInventoryPicker, setShowInventoryPicker] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const scrollViewRef = useRef(null);

  const categories = ["Dairy", "Produce", "Grains", "Meat", "Snacks", "Beverages", "Others"];

  useEffect(() => {
    if (isLoaded && user) {
      fetchItems();
      fetchCartItems();
    }
  }, [user, isLoaded]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${General.API_BASE_URL}api/items/getexpired?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch inventory items');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart?userId=${user.id}`);
      const data = await response.json();
      if (Array.isArray(data.items)) {
        setCartItems(data.items);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInventorySelect = (item) => {
    setSelectedInventoryItem(item);
    setSelectedInventoryLabel(
      item ? `${JSON.parse(item).name} - Expires in ${JSON.parse(item).daysToExpiry} days` : "Select from Inventory"
    );
    setShowInventoryPicker(false);
  };

  const renderInventoryPicker = () => {
    if (Platform.OS === 'android') {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedInventoryItem}
            onValueChange={handleInventorySelect}
            style={styles.picker}
          >
            <Picker.Item label="Select from Inventory" value="" />
            {inventory.map((item, index) => (
              <Picker.Item
                key={index}
                label={`${item.name} - Expires in ${item.daysToExpiry} days`}
                value={JSON.stringify(item)}
              />
            ))}
          </Picker>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.iosPickerButton}
        onPress={() => setShowInventoryPicker(true)}
      >
        <Text style={styles.iosPickerButtonText}>{selectedInventoryLabel}</Text>
        <Icon name="arrow-drop-down" size={24} color="#2a1581" />
      </TouchableOpacity>
    );
  };

  const addItem = async (inventoryItem = null) => {
    setIsLoading(true);
    const newItem = inventoryItem ? {
      userId: user.id,
      name: inventoryItem.name,
      category: inventoryItem.category || "Others",
      quantity: 1,
      price: inventoryItem.price || 0,
      priority: inventoryItem.daysToExpiry < 3 ? "urgent" : "low",
      status: inventoryItem.status || "fresh",
    } : {
      userId: user.id,
      name: "",
      category: "Others",
      quantity: 1,
      price: 0,
      priority: "low",
      status: "fresh",
    };

    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setCartItems(prev => [...prev, responseData.item]);
        setSelectedInventoryItem("");
        setSelectedInventoryLabel("Select from Inventory");
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } else {
        Alert.alert('Error', `Failed to add item: ${responseData.message}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedUpdate = useCallback(async (itemId, updatedData) => {
    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to update item');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
  }, []);

  const updateItem = (index, key, value) => {
    const updatedCart = [...cartItems];
    const item = updatedCart[index];
    updatedCart[index] = { ...item, [key]: value };
    setCartItems(updatedCart);

    if (updateTimers[item._id]) {
      clearTimeout(updateTimers[item._id]);
    }

    const newTimer = setTimeout(() => {
      debouncedUpdate(item._id, updatedCart[index]);
      setUpdateTimers(prev => ({ ...prev, [item._id]: null }));
    }, 1000);

    setUpdateTimers(prev => ({ ...prev, [item._id]: newTimer }));
  };

  const removeItem = async (index) => {
    const itemToRemove = cartItems[index];
    setIsLoading(true);

    try {
      const response = await fetch(`${General.API_BASE_URL}api/cart/${itemToRemove._id}`, {
        method: "DELETE",
      });

      const responseData = await response.json();

      if (responseData.success) {
        setCartItems(prev => prev.filter((_, i) => i !== index));
      } else {
        Alert.alert('Error', 'Failed to delete item');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalCost = useCallback(() => {
    const cost = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    setTotalCost(cost);
  }, [cartItems]);

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems, calculateTotalCost]);

  const renderCartItem = (item, index) => (
    <View key={index} style={styles.cartItem}>
      <View style={styles.cartItemHeader}>
        <TextInput
          style={styles.nameInput}
          placeholder="Item Name"
          value={item.name}
          onChangeText={(text) => updateItem(index, "name", text)}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => removeItem(index)} style={styles.deleteButton}>
          <Icon name="delete" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => {
          setSelectedItemIndex(index);
          setShowCategoryPicker(true);
        }}
      >
        <Text style={styles.categoryButtonText}>{item.category}</Text>
        <Icon name="arrow-drop-down" size={24} color="#2a1581" />
      </TouchableOpacity>

      <View style={styles.priceQuantityContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0"
            keyboardType="numeric"
            value={String(item.price || '')}
            onChangeText={(text) => updateItem(index, "price", parseFloat(text) || 0)}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Quantity</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateItem(index, "quantity", Math.max((item.quantity || 1) - 1, 1))}
            >
              <Icon name="remove" size={20} color="#2a1581" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity || 1}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateItem(index, "quantity", (item.quantity || 1) + 1)}
            >
              <Icon name="add" size={20} color="#2a1581" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.priorityChip, item.priority === "urgent" && styles.urgentChip]}
        onPress={() => updateItem(index, "priority", item.priority === "urgent" ? "low" : "urgent")}
      >
        <Text style={[styles.priorityText, item.priority === "urgent" && styles.urgentText]}>
          {item.priority === "urgent" ? "Urgent" : "Low Priority"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />
      <Seperator height={StatusBar.currentHeight} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart Companion</Text>
        </View>

        <View style={styles.inventoryPicker}>
          {renderInventoryPicker()}
          <TouchableOpacity
            style={[styles.addButton, !selectedInventoryItem && styles.buttonDisabled]}
            onPress={() => {
              if (selectedInventoryItem) {
                const item = JSON.parse(selectedInventoryItem);
                addItem(item);
              }
            }}
            disabled={!selectedInventoryItem}
          >
            <Text style={styles.buttonText}>Add from Inventory</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.cartList}
          contentContainerStyle={styles.cartListContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {cartItems.map((item, index) => renderCartItem(item, index))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addEmptyButton}
            onPress={() => addItem()}
          >
            <Icon name="add" size={24} color="white" />
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalCost}>₹{totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <Modal
          visible={showInventoryPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowInventoryPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowInventoryPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Item from Inventory</Text>
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={() => setShowInventoryPicker(false)}
                  >
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.inventoryList}>
                  <TouchableOpacity
                    style={styles.inventoryOption}
                    onPress={() => handleInventorySelect("")}
                  >
                    <Text style={styles.inventoryOptionText}>Select from Inventory</Text>
                  </TouchableOpacity>
                  
                  {inventory.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.inventoryOption,
                        selectedInventoryItem === JSON.stringify(item) && styles.selectedInventoryOption
                      ]}
                      onPress={() => handleInventorySelect(JSON.stringify(item))}
                    >
                      <View>
                        <Text style={[
                          styles.inventoryOptionText,
                          selectedInventoryItem === JSON.stringify(item) && styles.selectedInventoryOptionText
                        ]}>
                          {item.name}
                        </Text>
                        <Text style={styles.inventoryOptionSubtext}>
                          Expires in {item.daysToExpiry} days
                        </Text>
                      </View>
                      {selectedInventoryItem === JSON.stringify(item) && (
                        <Icon name="check" size={24} color="#2a1581" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View></TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={showCategoryPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowCategoryPicker(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryOption}
                    onPress={() => {
                      updateItem(selectedItemIndex, "category", category);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.categoryOptionText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#2a1581" />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  inventoryPicker: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  iosPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  iosPickerButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    marginRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deleteButton: {
    padding: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryButtonText: {
    fontSize: 16,
    color: 'black',
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  quantityContainer: {
    flex: 1,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  priorityChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  urgentChip: {
    backgroundColor: '#ffebee',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  urgentText: {
    color: '#ff4444',
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addEmptyButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  totalCost: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  inventoryList: {
    maxHeight: 400,
  },
  inventoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedInventoryOption: {
    backgroundColor: '#f0f4ff',
  },
  inventoryOptionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  selectedInventoryOptionText: {
    color: '#2a1581',
    fontWeight: '600',
  },
  inventoryOptionSubtext: {
    fontSize: 14,
    color: '#666',
  },
  categoryOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartCompanion;


















