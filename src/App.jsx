import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const genres = ['Pop', 'Rock', 'Indie', 'Jazz']
const roles = ['Creator', 'Listener']

const blankTrack = {
  title: '',
  genre: 'Pop',
  artist: '',
  bpm: '',
  label: '',
  role: 'Creator',
}

function validateTrack(track) {
  const errors = {}
  const bpm = Number(track.bpm)

  if (track.title.trim().length < 3) {
    errors.title = 'Track title needs at least 3 characters.'
  }

  if (!genres.includes(track.genre)) {
    errors.genre = 'Please choose a listed genre.'
  }

  if (track.artist.trim().length < 3) {
    errors.artist = 'Artist name needs at least 3 characters.'
  }

  if (!Number.isInteger(bpm) || bpm < 1 || bpm > 100) {
    errors.bpm = 'Rating / BPM must be from 1 to 100.'
  }

  if (track.label.trim().length < 3) {
    errors.label = 'Record label needs at least 3 characters.'
  }

  if (!roles.includes(track.role)) {
    errors.role = 'Choose a user role.'
  }

  return errors
}

function App() {
  const [form, setForm] = useState(blankTrack)
  const [tracks, setTracks] = useState([])
  const [errors, setErrors] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 4 })
  const [roleFilter, setRoleFilter] = useState('All')
  const [activeTrackId, setActiveTrackId] = useState(null)
  const [activeTrack, setActiveTrack] = useState(null)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Track Title',
      },
      {
        accessorKey: 'genre',
        header: 'Genre',
      },
      {
        accessorKey: 'artist',
        header: 'Artist',
      },
      {
        accessorKey: 'bpm',
        header: 'Rating / BPM',
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
    ],
    [],
  )

  const filteredTracks = useMemo(() => {
    if (roleFilter === 'All') {
      return tracks
    }

    return tracks.filter((track) => track.role === roleFilter)
  }, [roleFilter, tracks])

  const table = useReactTable({
    data: filteredTracks,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  useEffect(() => {
    const nextActiveTrack = filteredTracks.find(
      (track) => track.id === activeTrackId,
    )

    setActiveTrack(nextActiveTrack ?? filteredTracks[0] ?? null)
  }, [activeTrackId, filteredTracks])

  const updateField = (field, value) => {
    const nextForm = { ...form, [field]: value }
    setForm(nextForm)
    setErrors(validateTrack(nextForm))
  }

  const saveTrack = (event) => {
    event.preventDefault()

    const nextErrors = validateTrack(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const track = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      genre: form.genre,
      artist: form.artist.trim(),
      bpm: Number(form.bpm),
      label: form.label.trim(),
      role: form.role,
      addedAt: new Date().toLocaleDateString(),
    }

    setTracks((currentTracks) => [...currentTracks, track])
    setActiveTrackId(track.id)
    setPagination((currentPagination) => ({
      ...currentPagination,
      pageIndex: Math.floor(tracks.length / currentPagination.pageSize),
    }))
    setForm(blankTrack)
    setErrors({})
  }

  const applyRoleFilter = (role) => {
    setRoleFilter(role)
    setPagination((currentPagination) => ({
      ...currentPagination,
      pageIndex: 0,
    }))
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Set A</p>
          <h1>Playlist Tracker</h1>
          <p className="hero-copy">
            Save tracks for a Spotify-style playlist and keep the entries ready
            for review.
          </p>
        </div>
        <div className="playlist-stat">
          <span>{tracks.length}</span>
          tracks saved
        </div>
      </section>

      <section className="workspace">
        <form className="track-form" onSubmit={saveTrack} noValidate>
          <div className="section-heading">
            <p className="eyebrow">Phase 1</p>
            <h2>Track Registration</h2>
          </div>

          <label>
            Track Title
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Midnight City"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </label>

          <label>
            Genre
            <select
              value={form.genre}
              onChange={(event) => updateField('genre', event.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <span className="error">{errors.genre}</span>}
          </label>

          <label>
            Artist Name
            <input
              value={form.artist}
              onChange={(event) => updateField('artist', event.target.value)}
              placeholder="M83"
            />
            {errors.artist && <span className="error">{errors.artist}</span>}
          </label>

          <label>
            Rating / BPM
            <input
              min="1"
              max="100"
              type="number"
              value={form.bpm}
              onChange={(event) => updateField('bpm', event.target.value)}
              placeholder="88"
            />
            {errors.bpm && <span className="error">{errors.bpm}</span>}
          </label>

          <label>
            Record Label
            <input
              value={form.label}
              onChange={(event) => updateField('label', event.target.value)}
              placeholder="Mute Records"
            />
            {errors.label && <span className="error">{errors.label}</span>}
          </label>

          <fieldset>
            <legend>User Role</legend>
            <div className="role-options">
              {roles.map((role) => (
                <label className="radio-option" key={role}>
                  <input
                    checked={form.role === role}
                    name="role"
                    type="radio"
                    value={role}
                    onChange={(event) => updateField('role', event.target.value)}
                  />
                  {role}
                </label>
              ))}
            </div>
            {errors.role && <span className="error">{errors.role}</span>}
          </fieldset>

          <button className="primary-action" type="submit">
            Save Track
          </button>
        </form>

        {tracks.length > 0 && (
          <section className="registry-panel">
            <div className="section-heading">
              <p className="eyebrow">Phase 2</p>
              <h2>Playlist Registry</h2>
            </div>

            <div className="table-toolbar">
              {['All', ...roles].map((role) => (
                <button
                  className={roleFilter === role ? 'is-active' : ''}
                  key={role}
                  type="button"
                  onClick={() => applyRoleFilter(role)}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length}>
                        No tracks match the current role filter.
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        className={
                          activeTrack?.id === row.original.id
                            ? 'selected-row'
                            : ''
                        }
                        key={row.id}
                        onClick={() => setActiveTrackId(row.original.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {Math.max(table.getPageCount(), 1)}
              </span>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {activeTrack && (
          <aside className="detail-card">
            <div className="section-heading">
              <p className="eyebrow">Phase 3</p>
              <h2>Active Track</h2>
            </div>

            <div className="detail-main">
              <span className="role-badge">{activeTrack.role}</span>
              <h3>{activeTrack.title}</h3>
              <p>
                {activeTrack.artist} keeps this entry under {activeTrack.label}.
              </p>
            </div>

            <dl>
              <div>
                <dt>Genre</dt>
                <dd>{activeTrack.genre}</dd>
              </div>
              <div>
                <dt>Rating / BPM</dt>
                <dd>{activeTrack.bpm}</dd>
              </div>
              <div>
                <dt>Added</dt>
                <dd>{activeTrack.addedAt}</dd>
              </div>
            </dl>
          </aside>
        )}
      </section>
    </main>
  )
}

export default App
