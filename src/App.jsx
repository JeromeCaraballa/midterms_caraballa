import { useState } from 'react'
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

    setTracks((currentTracks) => [
      ...currentTracks,
      {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        genre: form.genre,
        artist: form.artist.trim(),
        bpm: Number(form.bpm),
        label: form.label.trim(),
        role: form.role,
        addedAt: new Date().toLocaleDateString(),
      },
    ])
    setForm(blankTrack)
    setErrors({})
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
      </section>
    </main>
  )
}

export default App
