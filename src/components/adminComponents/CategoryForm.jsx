import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
});

const CategoryForm = ({ initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        type="text"
        {...register('title')}
        className="p-2 border border-gray-300 rounded"
        placeholder="Category Title"
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      
      <textarea
        {...register('description')}
        className="p-2 border border-gray-300 rounded"
        placeholder="Category Description"
      />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}

      <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save</button>
    </form>
  );
};

export default CategoryForm;
