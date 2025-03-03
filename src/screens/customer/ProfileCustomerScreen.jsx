import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileCustomerScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.header} >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={require('../../assets/Profile.png')} style={styles.avatar} />
      </View>
      
      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value="Hoàng Phương Chi" editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value="Hphuongchi203@gmail.com" editable={false} />

        <Text style={styles.label}>Delivery Address</Text>
        <TextInput style={styles.input} value="30 Yên Bình, Thạch Thất, Hà Nội" editable={false} />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value="********" secureTextEntry editable={false} />
      </View>

      {/* Payment Details & Order History */}
      <TouchableOpacity style={styles.optionRow}>
        <Text style={styles.optionText}>Payment Details</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionRow}>
        <Text style={styles.optionText}>Order History</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color='#EADDFF' />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#999" />
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: { padding: 20, backgroundColor: '#F8F6FF', flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#7C3AED' },
  infoContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: '#F1F1F1', padding: 10, borderRadius: 8, marginBottom: 15 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'white', borderRadius: 10, marginBottom: 10 },
  optionText: { fontSize: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  editButton: { flexDirection: 'row',backgroundColor: '#648DDB', padding: 12, borderRadius: 10, alignItems: 'center', flex: 1, justifyContent: 'center', marginRight: 10, },
  editButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
  logoutButton: { flexDirection: 'row', backgroundColor: 'white',  padding: 12, borderRadius: 10, alignItems: 'center', flex: 1, justifyContent: 'center', borderColor:'#EADDFF', borderWidth:2 },
  logoutButtonText: { color: '#EADDFF', fontWeight: 'bold', marginLeft: 5 },
};

export default ProfileCustomerScreen;
