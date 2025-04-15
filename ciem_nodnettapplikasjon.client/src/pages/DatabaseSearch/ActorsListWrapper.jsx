// /src/pages/DatabaseSearch/ActorsListWrapper.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ActorsList from '../../components/ActorsList/ActorsList';

const ActorsListWrapper = () => {
    const { category } = useParams();

    return <ActorsList category={category} />;
};

export default ActorsListWrapper;
