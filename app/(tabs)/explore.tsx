import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign, EvilIcons } from '@expo/vector-icons'



const index = () => {

const [isChecked, setIsChecked] = useState(false);
const [task, setTask] = useState('')
const [list, setList] = useState([])
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);

const addTask = () => {
  if (task.trim() === '') return;

  const newTask = {
    id: Date.now().toString(),
    title: task.trim(),
    isChecked: false,
  };

  setList([...list, newTask]);
  setTask('');
};

const saveTasks = async() => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(list));
    console.log('Berhasil simpan');
  } catch (error) {
    console.log('Gagal simpan:', error);
  }
};

const loadTasks = async() => {
  try {
    const saved = await AsyncStorage.getItem('tasks');
    if (saved !== null) {
      setList(JSON.parse(saved));
    }
  } catch (error) {
    console.log('Gagal load:', error);
  }
};

const deleteTask = (id: string) => {
  const filtered = list.filter((item) => item.id !== id);
  setList(filtered);
};

const handleEdit = () => {
  const updated = list.map(item => item.id === editId ? {...item, title: task} : item);
  setList(updated);
  setIsEditing(false);
  setEditId(null);
  setTask('');
}

const startEdit = (item:any) => {
  setTask(item.title);
  setIsEditing(true);
  setEditId(item.id);
}

useEffect(() => {
  loadTasks();
}, []);

useEffect(() => {
  saveTasks();
}, [list]);


  return (
    <View style={tailwind`bg-blue-500 h-full`}>
      <View style={tailwind`bg-blue-500 h-full`}>
        <Text style={tailwind`text-3xl font-bold mt-15 mx-10 mb-10`}>📚 nGopoyo</Text>
        <View style={tailwind`gap-3 bg-white shadow-2xl p-10 rounded-3xl mx-3 flex-row items-center justify-between mb-5`}>
          {/* Input */}
            <TextInput style={tailwind`bg-white border-2 border-gray-300 rounded-xl p-5 w-80%`} placeholder='Mau Ngapain Hari Ini?'
            value={task}
            onChangeText={setTask}
            />
            <TouchableOpacity style={tailwind`w-20% bg-blue-500 rounded-xl items-center justify-center h-15`}
            onPress={() => {
              if (task.trim() === '') {
                Alert.alert('Error', 'Tugas tidak boleh kosong')
                return; // jangan lakukan apa-apa jika task kosong
              } 

              if (task.length < 2) {
                Alert.alert('Error', 'Tugas terlalu pendek')
                return; // jangan lakukan apa-apa jika task terlalu pendek
              }

              if (isEditing) {
                Alert.alert(
                  'Konfirmasi',
                  'Apakah Kamu yakin ingin mengubah tugas ini?',
                  [
                    {text: 'Batal', style: 'cancel'},
                    {text: 'Ubah', onPress: () =>{
                      handleEdit();
                      Alert.alert('Berhasil', 'Tugas berhasil diubah');
                    }},
                  ]
                );
              } else {
                addTask();
                Alert.alert('Berhasil', 'Tugas berhasil ditambahkan');
              }
            }}>
              <Text style={tailwind`text-white text-center font-bold text-3xl`}>+</Text>
            </TouchableOpacity>
        </View>
        <View style={tailwind`bg-white h-full rounded-3xl p-10 mx-3`}>
          {list.length === 0 ? (
            <Text style={tailwind`text-md font-bold mb-5 text-center text-gray-500`}>YEAY GAK ADA TUGAS</Text>
          ) : (
            <Text style={tailwind`text-md font-bold mb-5 text-gray-500`}>ADA TUGAS NI KAMU!</Text>
          )}

          <ScrollView>
          <FlatList
            scrollEnabled={false}
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={tailwind`flex-row justify-between items-center mb-5`}>
                <View style={tailwind`flex-row items-center gap-3`}>
                  <View style={tailwind`flex-row items-center gap-3`}>
                    <TouchableOpacity 
                    style={item.isChecked ? tailwind`border border-white rounded h-6 w-6 bg-green-500` : tailwind`border border-gray-500 rounded h-6 w-6`} 
                    onPress={() => {
                      const updatedList = list.map((task) =>
                      task.id === item.id ? { ...task, isChecked: !task.isChecked } : task
                      );
                      setList(updatedList);
                    }}
                    >
                    {item.isChecked && <View style={tailwind`bg-green-500 w-full h-full rounded items-center justify-center`}>
                      <Text>✔</Text>
                    </View>}
                    </TouchableOpacity>
                    <Text style={tailwind``}>{item.title}</Text>
                  </View>
                </View>
                <View style={tailwind`flex-row items-center gap-3`}>
                  <TouchableOpacity onPress={() => {
                    Alert.alert(
                      'Konfirmasi',
                      'Apakah Kamu yakin ingin mengubah agenda ini?',
                      [
                        {text: 'Batal', style: 'cancel'},
                        {text: 'Ubah', style: 'destructive', onPress: () => startEdit(item)},
                      ]
                    )
                  }}>
                    <AntDesign name='edit' size={30} color='blue'/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    Alert.alert(
                      'Konfirmasi',
                      'Apakah Kamu yakin ingin menghapus agenda ini?',
                      [
                        {text: 'Batal', style: 'cancel'},
                        {text: 'Hapus', style: 'destructive', onPress: () => {
                      const updatedList = list.filter((task) => task.id !== item.id);
                      setList(updatedList);
                      } } 
                      ]
                    )
                  }}>
                    <EvilIcons name='trash' size={40} color='red'/>
                  </TouchableOpacity>
                </View>
                
              </View>
            )}/>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}


export default index