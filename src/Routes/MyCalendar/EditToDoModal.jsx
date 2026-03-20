import React from "react";
import { createPortal } from "react-dom";

export default function TodoModal({
  open,
  task,

  // UI/state
  showEditSection,
  setShowEditSection,

  editDescription,
  setEditDescription,
  editDate,
  setEditDate,
  editCategory,
  setEditCategory,

  showDeleteEventConfirmation,
  setShowDeleteEventConfirmation,

  editingIndex,
  setEditingIndex,
  descriptionChecklistToEdit,
  setDescriptionChecklistToEdit,

  hasEmptySlot,

  // callbacks
  onClose, // = () => loadGeneral(new Date(task.date))
  onUpdateTask, // = (taskId) => handleUpdateInfoTask(taskId)
  onDeleteTask, // = (taskId) => handleDeleteTask(taskId)
  onToggleChecklist, // = (i, taskId) => updateChecklistTask(i, taskId)
  onSaveChecklistDescription, // = (i, taskId, value) => updateChecklistTaskDescripton(i, taskId, value)
  onAddChecklistItem,

  // i18n / ui helpers
  UniversalTexts,
  partnerColor,
  textpartnerColorContrast,

  // components you already use
  HTwo,
}) {
  if (!open || !task) return null;

  return createPortal(
    <div
      className="todo-modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999, // bem alto
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "6px",
          boxShadow: "0 8px 32px #0002",
          minWidth: "340px",
          maxWidth: "95vw",
          padding: "1rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "900",
            transition: "background 0.2s",
          }}
          title="Fechar"
        >
          ×
        </button>

        <HTwo>{task.description || "ToDo"}</HTwo>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <span
            style={{
              background: "#f3f4f6",
              color: "#555",
              borderRadius: "6px",
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            {task.category}
          </span>

          <span
            style={{
              background: "#f3f4f6",
              color: "#555",
              borderRadius: "6px",
              padding: "4px 12px",
              fontWeight: 500,
            }}
          >
            {task.date}
          </span>

          <button
            onClick={() => {
              setEditCategory(task.category);
              setEditDate(task.date);
              setEditDescription(task.description);
              setShowEditSection(true);
            }}
            style={{
              background: partnerColor(),
              color: textpartnerColorContrast(),
              border: "none",
              borderRadius: "6px",
              padding: "6px 16px",
              fontWeight: 600,
              marginLeft: "8px",
              cursor: "pointer",
            }}
          >
            {UniversalTexts.edit}
          </button>
        </div>

        {/* EDIT SECTION */}
        {showEditSection && (
          <div
            style={{
              marginTop: "1rem",
              background: "#f6f6f6",
              borderRadius: "6px",
              padding: "1rem",
              boxShadow: "0 2px 8px #0001",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "320px",
            }}
          >
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Descrição"
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
              }}
            />

            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
              }}
            />

            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ddd",
              }}
            >
              <option value="">Selecione a categoria</option>
              <option value="personal">Vida pessoal</option>
              <option value="finance">Financeiro</option>
              <option value="work">Trabalho</option>
              <option value="study">Estudos</option>
              <option value="health">Saúde</option>
              <option value="family">Família</option>
              <option value="other">Outro</option>
            </select>

            {!showDeleteEventConfirmation && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => setShowDeleteEventConfirmation(true)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontWeight: 600,
                  }}
                >
                  {UniversalTexts.delete}
                </button>

                <button
                  onClick={() => setShowEditSection(false)}
                  style={{
                    background: "#eee",
                    color: "#333",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontWeight: 500,
                  }}
                >
                  {UniversalTexts.cancel}
                </button>

                <button
                  onClick={() => onUpdateTask(task._id)}
                  style={{
                    background: partnerColor(),
                    color: textpartnerColorContrast(),
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontWeight: 600,
                  }}
                >
                  {UniversalTexts.save}
                </button>
              </div>
            )}
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        <div
          style={{
            display: showDeleteEventConfirmation ? "block" : "none",
            background: "#f9fafb",
            borderRadius: "6px",
            padding: "12px 16px",
            boxShadow: "0 2px 8px #0001",
            border: "1px solid #e5e7eb",
            marginTop: "12px",
          }}
        >
          {UniversalTexts.deleteConfirm}
          <div style={{ display: "flex", margin: "2px", gap: "8px" }}>
            <button
              onClick={() => setShowDeleteEventConfirmation(false)}
              style={{
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 16px",
                fontWeight: 600,
              }}
            >
              {UniversalTexts.cancel}
            </button>
            <button
              onClick={() => onDeleteTask(task._id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 16px",
                fontWeight: 600,
              }}
            >
              {UniversalTexts.delete}
            </button>
          </div>
        </div>

        {/* CHECKLIST */}
        <div style={{ marginBottom: "1.2rem", marginTop: "16px" }}>
          <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>
            Checklist
          </span>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "10px 0 0 0",
              background: "#f9fafb",
              borderRadius: "6px",
              boxShadow: "0 2px 8px #0001",
              border: "1px solid #e5e7eb",
              maxWidth: "320px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
              const item = task[`checkList${i}`];
              const isEditing = editingIndex === i;

              if (!item || (!item.description && !isEditing)) return null;

              return (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderBottom: i < 5 ? "1px solid #eee" : "none",
                    transition: "background 0.2s",
                    background: item.checked ? "#e6fbe8" : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onToggleChecklist(i, task._id)}
                    style={{
                      accentColor: item.checked ? "#22c55e" : "#ddd",
                      width: "15px",
                      height: "15px",
                      marginRight: "12px",
                      cursor: "pointer",
                      boxShadow: item.checked ? "0 0 0 2px #22c55e33" : "none",
                    }}
                  />

                  {!isEditing ? (
                    <span
                      onClick={() => {
                        setEditingIndex(i);
                        setDescriptionChecklistToEdit(item.description || "");
                      }}
                      style={{ cursor: "text" }}
                    >
                      {item.description}
                    </span>
                  ) : (
                    <span>
                      <input
                        type="text"
                        value={descriptionChecklistToEdit}
                        autoFocus
                        onChange={(e) =>
                          setDescriptionChecklistToEdit(e.target.value)
                        }
                        onBlur={() => {
                          const value = descriptionChecklistToEdit.trim();
                          onSaveChecklistDescription(i, task._id, value);
                          setEditingIndex(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                          if (e.key === "Escape") {
                            setDescriptionChecklistToEdit(
                              item.description || ""
                            );
                            setEditingIndex(null);
                          }
                        }}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {hasEmptySlot && (
            <button
              type="button"
              onClick={onAddChecklistItem}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                background: "#fff",
                boxShadow: "0 1px 3px #0001",
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
