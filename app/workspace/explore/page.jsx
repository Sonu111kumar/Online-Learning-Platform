"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';

import { toast } from 'sonner';

function Explore() {
    const [courseList, setCourseList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();
    useEffect(() => {
        user && GetCourseList();
    }, [user])
    const GetCourseList = async (query = '') => {
        try{
        const result = await axios.get(`/api/courses?courseId=0&search=${query}`);
        console.log(result.data);
        setCourseList(result.data);
         } catch (err) {
        if (err.response?.status === 404) {
       toast.error("No courses found");
       setCourseList([]); // clear existing
         } else {
        toast.error("Something went wrong");
        }
}

    }
    const handleSearch = () => {
    GetCourseList(searchTerm);
    };
    return (
        <div>
            <h2 className='font-bold text-3xl mb-6'>Explore More Courses</h2>
            <div className='flex gap-5 max-w-md' >
                <Input placeholder="Search" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}/>
                <Button onClick={handleSearch}> <Search className='mr-2' /> Search </Button>
            </div>



            <div className='grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                {courseList.length > 0 ? courseList?.map((course, index) => (
                    <CourseCard course={course} key={index} refreshData={GetCourseList} />
                )) :
                    [0, 1, 2, 3].map((item, index) => (
                        <Skeleton key={index} className='w-full h-[240px]' />
                    ))
                }
                {courseList.length === 0 && <p className="text-gray-500 mt-4">No courses found.</p>}
            </div>
        </div>
    )
}

export default Explore