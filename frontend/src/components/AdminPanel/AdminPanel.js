import { React } from 'react';
import { Link, NavLink, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminWelcome from 'components/AdminWelcome';
import AdminPeriodList from 'components/AdminPeriodList';
import AdminPeriodForm from 'components/AdminPeriodForm';
import AdminCharacterList from 'components/AdminCharacterList';
import AdminCharacterForm from 'components/AdminCharacterForm';
import AdminStoryList from 'components/AdminStoryList';
import AdminStoryForm from 'components/AdminStoryForm';
import AdminEventList from 'components/AdminEventList';
import AdminEventForm from 'components/AdminEventForm';
import AdminBookList from 'components/AdminBookList';
import AdminBookForm from 'components/AdminBookForm';
import AdminDashboard from 'components/AdminDashboard';
import './style.css';

const navLinkClassNameFn = ({ isActive }) => (isActive ? 'admin__nav-link admin__nav-link--active' : 'admin__nav-link');

const AdminPanel = () => {
  const { t } = useTranslation();

  return (
    <div className="admin">
      <header className="admin__header">
      <div className="admin__title">{t('admin.title')}</div>
        <Link className="admin__logo" to="/" />
      </header>
      <div className="admin__columns">
        <aside className="admin__aside">
          <AdminWelcome />
          <nav className="admin__nav">
            <NavLink to="/admin" className={navLinkClassNameFn} end>
              {t('admin.link.dashboard')}
            </NavLink>
            <NavLink to="/admin/periods" className={navLinkClassNameFn}>
              {t('admin.link.period')}
            </NavLink>
            <NavLink to="/admin/books" className={navLinkClassNameFn}>
              {t('admin.link.book')}
            </NavLink>
            <NavLink to="/admin/stories" className={navLinkClassNameFn}>
              {t('admin.link.story')}
            </NavLink>
            <NavLink to="/admin/events" className={navLinkClassNameFn}>
              {t('admin.link.event')}
            </NavLink>
            <NavLink to="/admin/characters" className={navLinkClassNameFn}>
              {t('admin.link.character')}
            </NavLink>
          </nav>
        </aside>
        <div className="admin__main">
          <Routes>
            <Route path="periods" element={<AdminPeriodList />} />
            <Route path="periods/add" element={<AdminPeriodForm editMode={false} />} />
            <Route path="periods/edit/:id" element={<AdminPeriodForm editMode={true} />} />
            <Route path="characters" element={<AdminCharacterList />} />
            <Route path="characters/add" element={<AdminCharacterForm editMode={false} />} />
            <Route path="characters/edit/:id" element={<AdminCharacterForm editMode={true} />} />
            <Route path="stories" element={<AdminStoryList />} />
            <Route path="stories/add" element={<AdminStoryForm editMode={false} />} />
            <Route path="stories/edit/:id" element={<AdminStoryForm editMode={true} />} />
            <Route path="events" element={<AdminEventList />} />
            <Route path="events/add" element={<AdminEventForm editMode={false} />} />
            <Route path="events/edit/:id" element={<AdminEventForm editMode={false} />} />
            <Route path="books" element={<AdminBookList />} />
            <Route path="books/add" element={<AdminBookForm editMode={false} />} />
            <Route path="books/edit/:id" element={<AdminBookForm editMode={false} />} />
            <Route path="/" element={<AdminDashboard />} />
            <Route path="*" element="TBD" />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
