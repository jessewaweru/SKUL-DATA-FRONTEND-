import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import MetricSelector from "./MetricSelector";
import "../Analytics/analytics.css";

const AnalyticsBuilder = () => {
  const [availableMetrics, setAvailableMetrics] = useState([
    { id: "1", name: "Teacher Activity", category: "teachers" },
    { id: "2", name: "Student Attendance", category: "students" },
    { id: "3", name: "Class Performance", category: "classes" },
    { id: "4", name: "Document Usage", category: "documents" },
    { id: "5", name: "Report Generation", category: "reports" },
    { id: "6", name: "Parent Engagement", category: "parents" },
  ]);

  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [savedViews, setSavedViews] = useState([]);
  const [viewName, setViewName] = useState("");

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const items =
        source.droppableId === "available"
          ? [...availableMetrics]
          : [...selectedMetrics];
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === "available") {
        setAvailableMetrics(items);
      } else {
        setSelectedMetrics(items);
      }
    } else {
      // Moving between lists
      const sourceItems =
        source.droppableId === "available"
          ? [...availableMetrics]
          : [...selectedMetrics];
      const destItems =
        source.droppableId === "available"
          ? [...selectedMetrics]
          : [...availableMetrics];
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setAvailableMetrics(
        source.droppableId === "available" ? sourceItems : destItems
      );
      setSelectedMetrics(
        source.droppableId === "available" ? destItems : sourceItems
      );
    }
  };

  const saveView = () => {
    if (!viewName.trim() || selectedMetrics.length === 0) return;

    const newView = {
      id: Date.now().toString(),
      name: viewName,
      metrics: [...selectedMetrics],
    };

    setSavedViews([...savedViews, newView]);
    setViewName("");
  };

  const loadView = (viewId) => {
    const view = savedViews.find((v) => v.id === viewId);
    if (view) {
      // Move metrics back to available
      const newAvailable = [...availableMetrics];
      const metricsToMove = selectedMetrics.filter(
        (m) => !view.metrics.some((vm) => vm.id === m.id)
      );
      newAvailable.push(...metricsToMove);

      // Set selected to view metrics
      setSelectedMetrics(view.metrics);

      // Update available metrics
      setAvailableMetrics(
        newAvailable.filter((m) => !view.metrics.some((vm) => vm.id === m.id))
      );
    }
  };

  const deleteView = (viewId) => {
    setSavedViews(savedViews.filter((v) => v.id !== viewId));
  };

  return (
    <div className="analytics-builder">
      <div className="builder-header">
        <h2>Custom Analytics Builder</h2>
        <p>
          Create and save custom dashboard views with your most important
          metrics
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="builder-container">
          <div className="metrics-panel">
            <h3>Available Metrics</h3>
            <Droppable droppableId="available">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="metrics-list"
                >
                  {availableMetrics.map((metric, index) => (
                    <Draggable
                      key={metric.id}
                      draggableId={metric.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="metric-item"
                        >
                          <MetricSelector metric={metric} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="metrics-panel">
            <h3>Your Dashboard (Top 5)</h3>
            <Droppable droppableId="selected">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="metrics-list"
                >
                  {selectedMetrics.map((metric, index) => (
                    <Draggable
                      key={metric.id}
                      draggableId={metric.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="metric-item"
                        >
                          <MetricSelector metric={metric} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      <div className="save-view">
        <input
          type="text"
          placeholder="Name your view"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
        />
        <button
          onClick={saveView}
          disabled={!viewName.trim() || selectedMetrics.length === 0}
        >
          Save View
        </button>
      </div>

      {savedViews.length > 0 && (
        <div className="saved-views">
          <h3>Saved Views</h3>
          <div className="views-list">
            {savedViews.map((view) => (
              <div key={view.id} className="view-item">
                <span>{view.name}</span>
                <div className="view-actions">
                  <button onClick={() => loadView(view.id)}>Load</button>
                  <button onClick={() => deleteView(view.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsBuilder;
