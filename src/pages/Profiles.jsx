import React, { useState } from 'react';
import { navigate, useRoute } from '../router';
import { useApp } from '../context/AppContext';
import Avatar, { AVATAR_COLORS } from '../components/Avatar';
import { PencilIcon, PlusIcon } from '../components/Icons';

export default function Profiles() {
  const { query } = useRoute();
  const { profiles, selectProfile, addProfile, updateProfile, deleteProfile } = useApp();
  const [manage, setManage] = useState(query.manage === '1');
  const [editing, setEditing] = useState(null); // { id?, name, avatar, kids }

  const pick = (p) => {
    if (manage) {
      setEditing({ ...p });
      return;
    }
    selectProfile(p.id);
    navigate('/browse');
  };

  const saveEdit = () => {
    if (!editing.name.trim()) return;
    if (editing.id) updateProfile(editing.id, { name: editing.name.trim(), avatar: editing.avatar, kids: editing.kids });
    else addProfile(editing.name.trim(), editing.avatar, editing.kids);
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="profiles">
        <header className="profiles__header">
          <span className="logo logo--lg">JETIX</span>
        </header>
        <div className="profiles__edit">
          <h1>{editing.id ? 'Edit Profile' : 'Add Profile'}</h1>
          <div className="profiles__edit-body">
            <Avatar color={editing.avatar} size={140} />
            <div className="profiles__edit-fields">
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Name"
                maxLength={20}
                autoFocus
              />
              <div className="profiles__colors">
                {Object.keys(AVATAR_COLORS).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={editing.avatar === c ? 'is-active' : ''}
                    aria-label={c}
                    onClick={() => setEditing({ ...editing, avatar: c })}
                  >
                    <Avatar color={c} size={48} />
                  </button>
                ))}
              </div>
              <label className="profiles__kids">
                <input type="checkbox" checked={editing.kids} onChange={(e) => setEditing({ ...editing, kids: e.target.checked })} />
                Children's profile — only show titles rated U
              </label>
            </div>
          </div>
          <div className="profiles__edit-actions">
            <button className="btn btn--white" type="button" onClick={saveEdit}>
              Save
            </button>
            <button className="btn btn--outline" type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
            {editing.id && profiles.length > 1 && (
              <button
                className="btn btn--outline"
                type="button"
                onClick={() => {
                  deleteProfile(editing.id);
                  setEditing(null);
                }}
              >
                Delete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profiles">
      <header className="profiles__header">
        <span className="logo logo--lg">JETIX</span>
      </header>
      <div className="profiles__body">
        <h1>{manage ? 'Manage Profiles:' : "Who's watching?"}</h1>
        <ul className="profiles__list">
          {profiles.map((p) => (
            <li key={p.id}>
              <button type="button" className={`profile ${manage ? 'is-manage' : ''}`} onClick={() => pick(p)}>
                <span className="profile__avatar">
                  <Avatar color={p.avatar} size={140} />
                  {manage && (
                    <span className="profile__edit">
                      <PencilIcon />
                    </span>
                  )}
                </span>
                <span className="profile__name">{p.name}</span>
                {p.kids && <span className="profile__kids">Children</span>}
              </button>
            </li>
          ))}
          {profiles.length < 5 && (
            <li>
              <button type="button" className="profile profile--add" onClick={() => setEditing({ name: '', avatar: 'grey', kids: false })}>
                <span className="profile__avatar profile__avatar--add">
                  <PlusIcon width={48} height={48} />
                </span>
                <span className="profile__name">Add Profile</span>
              </button>
            </li>
          )}
        </ul>
        <button
          type="button"
          className={`btn ${manage ? 'btn--white' : 'btn--outline'} profiles__manage`}
          onClick={() => {
            setManage((m) => !m);
            navigate(manage ? '/profiles' : '/profiles?manage=1', { replace: true });
          }}
        >
          {manage ? 'Done' : 'Manage Profiles'}
        </button>
      </div>
    </div>
  );
}
