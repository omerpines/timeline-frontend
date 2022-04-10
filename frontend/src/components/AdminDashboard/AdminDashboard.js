import React from 'react';
import { useSelector } from 'react-redux';
import AdminPage from 'components/AdminPage';
import AdminRecent from 'components/AdminRecent';
import { getRecents } from 'store/selectors/data';
import './style.css';

const AdminDashboard = () => {
  const { periods, books, stories, events, characters } = useSelector(getRecents);

  return (
    <AdminPage>
      <div className="admin-dashboard">
        <AdminRecent
          form="period"
          data={periods}
          oddColor="rgba(220, 31, 87, .05)"
          evenColor="rgba(220, 31, 87, .01)"
        />
        <AdminRecent
          form="book"
          data={books}
          oddColor="rgba(222, 137, 9, 0.05)"
          evenColor="rgba(222, 137, 9, 0.01)"
        />
        <AdminRecent
          form="story"
          data={stories}
          oddColor="rgba(165, 210, 119, 0.05)"
          evenColor="rgba(165, 210, 119, 0.01)"
        />
        <AdminRecent
          form="character"
          data={characters}
          oddColor="rgba(0, 126, 180, 0.05)"
          evenColor="rgba(0, 126, 180, 0.01)"
        />
        <AdminRecent
          form="event"
          data={events}
          oddColor="rgba(165, 210, 119, 0.05)"
          evenColor="rgba(165, 210, 119, 0.01)"
        />
      </div>
    </AdminPage>
  );
};

export default AdminDashboard;
