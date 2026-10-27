'use client';
import {useEffect, useState} from 'react';

export type EditableQuestion = {
  id: string;
  word: string;
  clue: string;
};

export type StudioConfig = {
  title: string;
  roundSeconds: number;
  maxRounds: number;
  questions: Array<{word: string; display: string; clue: string}>;
};

export const PRESET_DECKS: Array<{
  id: string;
  label: string;
  title: string;
  questions: Array<{word: string; clue: string}>;
}> = [
  {
    id: 'amigos',
    label: '🎉 Entre Amigos',
    title: 'Noche de Amigos',
    questions: [
      {word: 'KARAOKE', clue: 'Actividad donde cantas tus canciones favoritas siguiendo la letra en una pantalla frente a tus amigos.'},
      {word: 'SPOILER', clue: 'Cuando alguien te arruina el final de una serie o película antes de que puedas verla.'},
      {word: 'WHATSAPP', clue: 'Aplicación de mensajería donde se crean los grupos para organizar planes que casi nunca salen.'},
      {word: 'PIZZA', clue: 'Comida redonda horneada con queso que siempre salva cualquier reunión nocturna con amigos.'},
      {word: 'FANTASMA', clue: 'Apodo para ese amigo que confirma que sí va a la reunión y a última hora desaparece sin avisar.'},
      {word: 'MEMES', clue: 'Imágenes o videos de humor que nos enviamos todos los días por redes sociales para reírnos.'},
      {word: 'VACACIONES', clue: 'Temporada libre de estudio o trabajo que todos planean durante meses para viajar y descansar.'}
    ]
  },
  {
    id: 'cultura',
    label: '🌎 Cultura General',
    title: 'Reto de Cultura General',
    questions: [
      {word: 'GRAVEDAD', clue: 'Fuerza invisible de la naturaleza que nos mantiene con los pies en la Tierra y hace caer los objetos.'},
      {word: 'AMAZONAS', clue: 'El río más caudaloso del planeta y hogar de la selva tropical más grande del mundo.'},
      {word: 'OXÍGENO', clue: 'Elemento químico presente en el aire e indispensable para la respiración de los seres vivos.'},
      {word: 'ECLIPSE', clue: 'Fenómeno astronómico en el que la Luna o la Tierra bloquean temporalmente la luz del Sol.'},
      {word: 'VOLCÁN', clue: 'Montaña o abertura de la corteza terrestre por donde emerge magma, ceniza y gases del interior.'},
      {word: 'BRÚJULA', clue: 'Instrumento con una aguja imantada que señala siempre el norte y sirve para orientarse.'},
      {word: 'GALAXIA', clue: 'Inmenso conjunto de miles de millones de estrellas, planetas, gas y polvo cósmico unidos en el espacio.'}
    ]
  },
  {
    id: 'cine',
    label: '🎬 Cine y Música',
    title: 'Cine, Series y Música',
    questions: [
      {word: 'PALOMITAS', clue: 'Maíz inflado que nunca puede faltar en tus manos cuando entras a una sala de cine.'},
      {word: 'CONCIERTO', clue: 'Espectáculo musical en vivo donde miles de personas cantan frente al escenario de su artista favorito.'},
      {word: 'TITANIC', clue: 'Famoso transatlántico cuya historia inspiró una de las películas más taquilleras de la historia.'},
      {word: 'GUITARRA', clue: 'Instrumento musical de seis cuerdas protagonista en el rock, el pop y la música acústica.'},
      {word: 'DIRECTOR', clue: 'Persona encargada de guiar a los actores y tomar las decisiones creativas al filmar una película.'},
      {word: 'COMEDIA', clue: 'Género de películas o series cuyo objetivo principal es hacer reír al público.'}
    ]
  },
  {
    id: 'exposicion',
    label: '🎓 Exposición / Clase',
    title: 'Dinámica de Exposición',
    questions: [
      {word: 'PROYECTO', clue: 'Conjunto de actividades planificadas que buscan alcanzar un objetivo específico en un tiempo determinado.'},
      {word: 'HIPÓTESIS', clue: 'Suposición inicial que se plantea en una investigación para luego comprobar si es verdadera o falsa.'},
      {word: 'INNOVACIÓN', clue: 'Creación o mejora significativa de un producto, servicio o proceso que aporta un nuevo valor.'},
      {word: 'ESTRATEGIA', clue: 'Plan general de acción diseñado para alcanzar una meta importante o resolver un problema.'},
      {word: 'DEBATE', clue: 'Intercambio organizado de ideas y argumentos entre varias personas sobre un mismo tema.'}
    ]
  }
];

function cleanLettersCount(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
    .slice(0, 18);
}

const STORAGE_KEY = 'ahorcado-studio-v2';

export function QuestionStudio({
  initialTitle = '',
  initialRoundSeconds = 60,
  initialQuestions,
  mode = 'create',
  busy = false,
  onCancel,
  onSubmit
}: {
  initialTitle?: string;
  initialRoundSeconds?: number;
  initialQuestions?: Array<{word?: string; display?: string; clue: string}>;
  mode?: 'create' | 'edit';
  busy?: boolean;
  onCancel: () => void;
  onSubmit: (config: StudioConfig) => void;
}) {
  const [title, setTitle] = useState(initialTitle || 'Noche de Amigos');
  const [roundSeconds, setRoundSeconds] = useState(initialRoundSeconds || 60);
  const [maxRounds, setMaxRounds] = useState<number>(5);
  const [activePreset, setActivePreset] = useState<string>('amigos');
  const [showBulkPaste, setShowBulkPaste] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [localError, setLocalError] = useState('');

  const [items, setItems] = useState<EditableQuestion[]>(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions.map((q, idx) => ({
        id: `q-${idx}-${Date.now()}`,
        word: (q.display || q.word || '').trim().toUpperCase(),
        clue: q.clue
      }));
    }
    return PRESET_DECKS[0].questions.map((q, idx) => ({
      id: `q-${idx}`,
      word: q.word.trim().toUpperCase(),
      clue: q.clue
    }));
  });

  useEffect(() => {
    try {
      localStorage.removeItem('ahorcado-custom-studio-v1');
    } catch {}
    if (mode !== 'create') return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved.items) && saved.items.length > 0) {
        setTitle(saved.title || '');
        setRoundSeconds(saved.roundSeconds || 60);
        setMaxRounds(saved.maxRounds || 5);
        setActivePreset(saved.activePreset || 'custom');
        setItems(saved.items);
      }
    } catch {}
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({title, roundSeconds, maxRounds, activePreset, items})
      );
    } catch {}
  }, [title, roundSeconds, maxRounds, activePreset, items]);

  function selectPreset(presetId: string) {
    setLocalError('');
    if (presetId === 'blank') {
      setActivePreset('blank');
      setTitle('');
      setItems([
        {id: `q-1-${Date.now()}`, word: '', clue: ''},
        {id: `q-2-${Date.now()}`, word: '', clue: ''},
        {id: `q-3-${Date.now()}`, word: '', clue: ''},
        {id: `q-4-${Date.now()}`, word: '', clue: ''},
        {id: `q-5-${Date.now()}`, word: '', clue: ''}
      ]);
      setMaxRounds(5);
      return;
    }
    const found = PRESET_DECKS.find(d => d.id === presetId);
    if (!found) return;
    setActivePreset(presetId);
    setTitle(found.title);
    setItems(
      found.questions.map((q, idx) => ({
        id: `q-${idx}-${Date.now()}`,
        word: q.word.trim().toUpperCase(),
        clue: q.clue
      }))
    );
    setMaxRounds(Math.min(5, found.questions.length));
  }

  function updateItem(id: string, field: 'word' | 'clue', value: string) {
    setLocalError('');
    setActivePreset('custom');
    setItems(prev =>
      prev.map(it =>
        it.id === id
          ? {
              ...it,
              [field]:
                field === 'word'
                  ? value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').slice(0, 18)
                  : value.slice(0, 220)
            }
          : it
      )
    );
  }

  function addQuestion() {
    if (items.length >= 20) return;
    setLocalError('');
    setItems(prev => [...prev, {id: `q-${Date.now()}-${Math.random()}`, word: '', clue: ''}]);
  }

  function removeQuestion(id: string) {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(it => it.id !== id));
  }

  function handleBulkImport() {
    const lines = bulkText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);
    const parsed: EditableQuestion[] = [];
    for (const line of lines) {
      const sepMatch = line.match(/^([^:=\-–]+)\s*[:=\-–]\s*(.+)$/);
      if (sepMatch) {
        const w = sepMatch[1].trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').slice(0, 18);
        const c = sepMatch[2].trim().slice(0, 220);
        if (cleanLettersCount(w).length >= 2 && c) {
          parsed.push({id: `bulk-${parsed.length}-${Date.now()}`, word: w, clue: c});
        }
      }
    }
    if (!parsed.length) {
      setLocalError('Escribe una por línea con el formato: PALABRA : Pregunta o pista');
      return;
    }
    setItems(parsed.slice(0, 20));
    setMaxRounds(Math.min(parsed.length, 5));
    setActivePreset('custom');
    setBulkText('');
    setShowBulkPaste(false);
    setLocalError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = items
      .map(it => {
        const clean = cleanLettersCount(it.word);
        const display = it.word.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').slice(0, 18) || clean;
        const clue = it.clue.trim();
        return {word: clean, display, clue};
      })
      .filter(it => it.word.length >= 2 && it.clue.length >= 3);

    if (!valid.length) {
      setLocalError('Escribe al menos 1 palabra (mínimo 2 letras) con su pregunta o pista.');
      return;
    }

    const finalRounds = Math.max(1, Math.min(valid.length, maxRounds || valid.length));
    onSubmit({
      title: title.trim(),
      roundSeconds,
      maxRounds: finalRounds,
      questions: valid
    });
  }

  const validCount = items.filter(it => cleanLettersCount(it.word).length >= 2 && it.clue.trim().length >= 3).length;
  const effectiveRounds = Math.max(1, Math.min(validCount || 1, maxRounds));

  return (
    <div className="studioContainer">
      <div className="studioTopBar">
        <div>
          <h2>{mode === 'edit' ? 'Editar preguntas de la sala' : 'Configura tu partida'}</h2>
          <p>Escribe tus propias preguntas para tu exposición o elige un tema para jugar con amigos.</p>
        </div>
        <button type="button" className="studioBackPill" onClick={onCancel}>
          ✕ Cerrar
        </button>
      </div>

      {/* Clean Pill Selector for Presets */}
      <div className="presetPillBar" role="tablist" aria-label="Plantillas de preguntas">
        <button
          type="button"
          className={'presetPill ' + (activePreset === 'blank' ? 'active' : '')}
          onClick={() => selectPreset('blank')}
        >
          ✍️ Mis propias preguntas
        </button>
        {PRESET_DECKS.map(deck => (
          <button
            type="button"
            key={deck.id}
            className={'presetPill ' + (activePreset === deck.id ? 'active' : '')}
            onClick={() => selectPreset(deck.id)}
          >
            {deck.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="studioForm">
        {/* Clean Soft Settings Row */}
        <div className="studioMetaRow">
          <div className="softInputWrap studioTitleBox">
            <input
              aria-label="Nombre del tema o exposición"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título opcional (ej. Mi Exposición / Noche de Amigos)"
              maxLength={60}
            />
          </div>

          <div className="studioCompactPills">
            <span className="miniMetaLabel">Rondas:</span>
            {[3, 5, 7, validCount || 5]
              .filter((v, i, a) => v >= 1 && a.indexOf(v) === i)
              .map(n => (
                <button
                  type="button"
                  key={n}
                  className={maxRounds === n ? 'active' : ''}
                  onClick={() => setMaxRounds(n)}
                >
                  {n === validCount && validCount > 0 ? `Todas (${n})` : n}
                </button>
              ))}
          </div>

          <div className="studioCompactPills">
            <span className="miniMetaLabel">Tiempo:</span>
            {[30, 45, 60, 90].map(sec => (
              <button
                type="button"
                key={sec}
                className={roundSeconds === sec ? 'active' : ''}
                onClick={() => setRoundSeconds(sec)}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Questions Header */}
        <div className="questionsToolbar">
          <span className="questionsCountBadge">
            <b>{validCount}</b> {validCount === 1 ? 'pregunta lista' : 'preguntas listas'}
          </span>
          <div className="questionsToolbarRight">
            <button
              type="button"
              className="toolbarGhostBtn"
              onClick={() => setShowBulkPaste(v => !v)}
            >
              {showBulkPaste ? 'Ocultar pegado rápido' : '⚡ Pegar lista'}
            </button>
            <button
              type="button"
              className="toolbarAddBtn"
              onClick={addQuestion}
              disabled={items.length >= 20}
            >
              + Añadir palabra
            </button>
          </div>
        </div>

        {showBulkPaste && (
          <div className="bulkPasteBox">
            <p>
              Pega varias líneas con el formato <code>PALABRA : Pregunta o pista</code>
            </p>
            <textarea
              rows={4}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              placeholder={`GRAVEDAD : Fuerza que nos mantiene con los pies en la Tierra.\nAMAZONAS : El río más caudaloso del planeta.`}
            />
            <div className="bulkPasteActions">
              <button type="button" className="limeBtn compactLimeBtn" onClick={handleBulkImport}>
                Cargar lista
              </button>
            </div>
          </div>
        )}

        {localError && (
          <div className="error" role="alert">
            <span>{localError}</span>
          </div>
        )}

        {/* Sleek Question Rows */}
        <div className="editableQuestionsList">
          {items.map((item, idx) => {
            const cleanLen = cleanLettersCount(item.word).length;
            return (
              <div key={item.id} className="questionRowCard">
                <span className="qRowIndex">{idx + 1}</span>
                <div className="qRowWordWrap">
                  <input
                    aria-label={`Palabra ${idx + 1}`}
                    value={item.word}
                    onChange={e => updateItem(item.id, 'word', e.target.value)}
                    placeholder="PALABRA"
                    maxLength={18}
                  />
                  <small className={cleanLen >= 2 ? 'ok' : 'empty'}>
                    {cleanLen ? `${cleanLen}L` : '—'}
                  </small>
                </div>
                <div className="qRowClueWrap">
                  <input
                    aria-label={`Pregunta o pista ${idx + 1}`}
                    value={item.clue}
                    onChange={e => updateItem(item.id, 'clue', e.target.value)}
                    placeholder="Escribe la pregunta o pista que verán los jugadores…"
                    maxLength={220}
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    className="qRowDeleteBtn"
                    onClick={() => removeQuestion(item.id)}
                    aria-label={`Borrar pregunta ${idx + 1}`}
                    title="Borrar"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="addMoreRowBtn"
          onClick={addQuestion}
          disabled={items.length >= 20}
        >
          + Agregar otra pregunta ({items.length}/20)
        </button>

        <div className="studioBottomBar">
          <button type="button" className="softGrayBtn studioCancelBtn" onClick={onCancel}>
            Volver
          </button>
          <button type="submit" className="limeBtn studioSubmitBtn" disabled={busy || validCount === 0}>
            {busy
              ? 'Creando…'
              : mode === 'edit'
              ? `Guardar preguntas (${effectiveRounds} ${effectiveRounds === 1 ? 'ronda' : 'rondas'})`
              : `Crear sala (${effectiveRounds} ${effectiveRounds === 1 ? 'ronda' : 'rondas'}) →`}
          </button>
        </div>
      </form>
    </div>
  );
}
