import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import AnsyncStorage from '@react-native-community/async-storage'

import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import api from '../../services/api'

import styles from './styles'

function TeacherList ({navigation}: any) {

    const [isFilterVisible, setIsFilterVisible] = useState(false)

    const [subject, setSubject] = useState('')
    const [week_day, setWeekDay] = useState('')
    const [time, setTime] = useState('')

    const [teachers, setTeachers] = useState([])

    const [favorites, setFavorites] = useState<number[]>([])

    function loadingFavorites () {
        AnsyncStorage.getItem('favorites').then(response => {
            if(response) {
                const favoritedTeachers = JSON.parse(response)
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return(teacher.id)
                })

                setFavorites(favoritedTeachersIds)
            }
        })
    }

    React.useEffect(() => {
        navigation.addListener('focus', () => {
            if(subject != '' && week_day != '' && time != '') {
                const realSubject = subject
                setSubject('')
                handleFiltersSubmit()
                setSubject(realSubject)
                handleFiltersSubmit()
            }
        });
    }, []);

    function handleToggleFilterVisible() {
        setIsFilterVisible(!isFilterVisible)
    }

    async function handleFiltersSubmit () {
        loadingFavorites()

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time
            }
        })

        setTeachers(response.data)
        setIsFilterVisible(!isFilterVisible)
    }

    const filterButton = (
        <BorderlessButton onPress={handleToggleFilterVisible} style={{padding: 10}}>
            <Feather name='filter' size={20} color='#fff'/>
        </BorderlessButton>
    )

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys dispoíveis" headerRight={filterButton}>
                {isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            placeholderTextColor='#c1bccc'
                            value={subject}
                            onChangeText={text => setSubject(text)}
                        />

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor='#c1bccc'
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual horário?"
                                    placeholderTextColor='#c1bccc'
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                />
                            </View>
                        </View>

                        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView style={styles.teacherList} contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16
            }}>
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>

        </View>
    )
}

export default TeacherList