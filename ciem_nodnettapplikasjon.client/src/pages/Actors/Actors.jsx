import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// DENNE FUNKER
// Create the Supabase client instance
const supabase = createClient(
  'https://vigjqzuqrnxapqxhkwds.supabase.co/',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ2pxenVxcm54YXBxeGhrd2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NzU2MjksImV4cCI6MjA1NzM1MTYyOX0.4vS7Yh-dgCEDacxGL8lz4Zp47lq28Xa3lfWV8NsiNyM'
);


function Actors() {

    const [users, setUsers] = useState();

    const fetchNewUsers = async () => {
        const { data } = await supabase.from('Users').select('*');

        if (data) {
            setUsers(data);
        }
    }

    const fetchUsers = async () => {
        const response = await fetch("https://localhost:5255/api/user/views");
            const data = await response.json();
            setUsers(data);
        };
    
        
        useEffect(() =>  {
            fetchUsers();
            supabase
                .channel('table-db-changes')
                .on('postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'Users',
            },
            (payload) => {
                fetchUsers();
              }
            )
            .subscribe(status => console.log(status))
            
        }, []);
    
    
    return (
            <div>
                <ul>
                    {users?.map((users, index) => (
                        <li key={index}>{users}</li>
                    ))}
                </ul>
            </div>
            )
    
        }

export default Actors;