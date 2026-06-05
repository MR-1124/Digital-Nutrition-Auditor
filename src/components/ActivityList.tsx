import React from 'react';
import { useNutritionStore, filterLogsByDate } from '../store';
import type { MacroType } from '../store';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Clock, GripVertical } from 'lucide-react';

const MACRO_CONFIG: Record<MacroType, { label: string; color: string; bg: string }> = {
  Educational: { label: 'Educational', color: 'text-zen-sage', bg: 'bg-macro-educational' },
  Entertainment: { label: 'Entertainment', color: 'text-zen-rose', bg: 'bg-macro-entertainment' },
  'High-Stress': { label: 'High-Stress', color: 'text-zen-clay', bg: 'bg-macro-stress' },
  'Brain-Rot': { label: 'Brain-Rot', color: 'text-zen-slate', bg: 'bg-macro-brainrot' },
};

export const ActivityList: React.FC = () => {
  const allLogs = useNutritionStore((state) => state.logs);
  const updateLogMacro = useNutritionStore((state) => state.updateLogMacro);
  
  const logs = filterLogsByDate(allLogs, new Date());

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === result.source.droppableId) return;

    updateLogMacro(draggableId, destination.droppableId as MacroType);
  };

  const categorizedLogs = (macro: MacroType) => logs.filter(l => l.macro === macro);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-zen-slate">Daily Plate Components</h2>
        <span className="text-[10px] font-bold text-zen-slate/30 uppercase tracking-widest bg-zen-sand/30 px-2 py-1 rounded">
          Drag to Re-Categorize
        </span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(MACRO_CONFIG) as MacroType[]).map((macro) => (
            <Droppable key={macro} droppableId={macro}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex flex-col p-3 rounded-2xl border transition-all duration-300 min-h-[120px] ${
                    snapshot.isDraggingOver ? 'bg-zen-sand/40 border-zen-sage scale-[1.02]' : 'bg-zen-surface/50 border-zen-sand'
                  }`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-tighter mb-3 flex items-center gap-2 ${MACRO_CONFIG[macro].color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${MACRO_CONFIG[macro].bg}`} />
                    {macro}
                    <span className="ml-auto opacity-40">{categorizedLogs(macro).length}</span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {categorizedLogs(macro).map((log, index) => (
                      <Draggable key={log.id} draggableId={log.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`group bg-zen-surface p-3 rounded-xl border border-zen-sand shadow-sm flex items-center gap-3 transition-shadow ${
                              snapshot.isDragging ? 'shadow-xl ring-2 ring-zen-sage/30' : 'hover:shadow-md'
                            }`}
                          >
                            <GripVertical size={14} className="text-zen-slate/10 group-hover:text-zen-slate/30 transition-colors" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-zen-slate truncate leading-tight">{log.name}</div>
                              <div className="flex items-center gap-1.5 text-[9px] text-zen-slate/40 font-medium">
                                <Clock size={10} />
                                {log.durationMinutes}m
                              </div>
                            </div>
                            {log.mood && (
                               <div className="text-[10px] opacity-60 filter grayscale group-hover:grayscale-0 transition-all">
                                 {log.mood === 'Happy' && '😊'}
                                 {log.mood === 'Calm' && '☕'}
                                 {log.mood === 'Focused' && '🧠'}
                                 {log.mood === 'Anxious' && '😰'}
                                 {log.mood === 'Drained' && '🔋'}
                               </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
