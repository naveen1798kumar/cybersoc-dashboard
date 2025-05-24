import React from 'react';

const SectionEditor = ({ sections, onAddSection, onDeleteSection }) => {
  return (
    <div>
      {sections.map((section, index) => (
        <div key={index} className="space-y-2">
          <h4>{section.title}</h4>
          <p>{section.content}</p>
          <button onClick={() => onDeleteSection(index)} className="text-red-500">Delete Section</button>
        </div>
      ))}
      <button onClick={onAddSection} className="bg-green-500 text-white p-2 rounded">Add Section</button>
    </div>
  );
};

export default SectionEditor;
