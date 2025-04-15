import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import  DateTimePicker  from '@react-native-community/datetimepicker'
import { Try } from 'expo-router/build/views/Try'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign, EvilIcons } from '@expo/vector-icons'

const index = () => {

  const [judul, setJudul] = useState('')
  const [mapel, setMapel] = useState('')
  const [deadline, setDeadLine] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [list, setList] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const showPicker = () => {
    setShowDatePicker(true);
  }

  const onDateChange = (event: any, selectedDate: any) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDeadLine(formatDate(currentDate));

  }

  
  
  const formatDate = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }

  const addTask = () => {
    if (judul === '' && mapel === '') return;
    const newTask = {
      id: Date.now().toString(),
      judul: judul.trim(),
      mapel: mapel.trim(),
      deadline: deadline,
      isChecked: false,
  };
    setList([...list, newTask]);
    setJudul('');
    setMapel('');
    setDeadLine('');
    setDate(new Date());
    setShowDatePicker(false);
    // Simpan newTask ke dalam state atau database sesuai kebutuhan
  }

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
    }
  }

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
  }

  const deleteTask = (id: string) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  }

  const handleEdit = () => {
    const updated = list.map(item => item.id  === editId ? {...item, judul: judul , mapel: mapel , deadline: deadline } : item);
    setList(updated)
    setIsEditing(false);
    setEditId(null);
    setJudul('');
    setMapel('');
    setDeadLine('');
  }

  const startEdit = (item: any) => {
    setJudul(item.judul);
    setMapel(item.mapel);
    setDeadLine(item.deadline);
    setEditId(item.id);
    setIsEditing(true);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);


  return (
    <View style={tailwind`bg-blue-500 h-full`}>
      <View style={tailwind`mb-10`}>
        <Text style={tailwind`text-3xl font-bold mt-15 mx-10 mb-10`}>📚 TugasLu</Text>
        <View style={tailwind`gap-3 bg-white shadow-2xl p-10 rounded-3xl mx-3`}>
          {/* tempat form */}
          <TextInput style={tailwind`bg-white border-2 border-gray-300 rounded-3xl p-5`}
          placeholder='Masukan judul tugas'
          value={judul}
          onChangeText={setJudul} />
          <TextInput style={tailwind`bg-white border-2 border-gray-300 rounded-3xl p-5`}
          placeholder='Masukan Mata Pelajaran'
          value={mapel}
          onChangeText={setMapel} />
          <View style={tailwind`flex-row items-center justify-between`}>
            <TextInput style={tailwind`bg-white border-2 border-gray-300 rounded-3xl p-5 w-3/4`}
            placeholder='Masukan Tanggal Deadline'
            value={deadline}
            editable={false} />
            <TouchableOpacity style={tailwind`h-15 w-15 bg-white border-2 border-gray-300 rounded-3xl items-center justify-center`}
            onPress={showPicker}>
              <Text style={tailwind`text-center text-2xl font-bold`}>📅</Text>

            </TouchableOpacity>
          </View>
          

          <TouchableOpacity style={tailwind`bg-green-500 rounded-3xl p-5`}
          onPress={isEditing ? handleEdit : addTask}>
            <Text style={tailwind`text-white text-center text-xl font-bold`}>Masukan Tugas</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              />
          )}
        </View>
      </View>
        <View style={tailwind`bg-white h-full rounded-3xl p-10 mx-5`}>
          <ScrollView>
            <FlatList
            style={tailwind`mb-130`}
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={tailwind`flex-row justify-between items-center mb-5 w-full p-5 rounded-3xl border border-gray-300 shadow bg-white`}>
                <View style={tailwind`gap-3`}>
                  <Text style={tailwind`font-bold text-2xl`}>{item.mapel}</Text>
                  <Text style={tailwind``}>{item.judul}</Text>
                  <Text style={tailwind``}>{item.deadline}</Text>
                </View>
                <View style={tailwind`items-center gap-3`}>
                  <TouchableOpacity onPress={() => startEdit(item)}
                    style={tailwind`bg-yellow-400 shadow-lg rounded-xl p-2 items-center justify-center w-15 h-15`}>
                    <AntDesign name='edit' size={35} color='black'/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    const updatedList = list.filter((task) => task.id !== item.id);
                    setList(updatedList);
                  }}
                    style={tailwind`bg-red-400 shadow-lg rounded-xl p-2 items-center justify-center w-15 h-15`}>
                    <EvilIcons name='trash' size={35} color='black'/>
                  </TouchableOpacity>
                </View>
                
              </View>
              
            )}
            scrollEnabled={false}
            />
            </ScrollView>
        </View>
    </View>
  )
}

export default index