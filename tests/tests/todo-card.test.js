import { describe, it, expect, beforeEach } from 'vitest';
import { getByTestId, fireEvent } from '@testing-library/dom';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');

describe('Todo Card', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it('card container exists', () => {
    expect(getByTestId(document.body, 'test-todo-card')).toBeInTheDocument();
  });

  it('title is visible', () => {
    const title = getByTestId(document.body, 'test-todo-title');
    expect(title).toBeInTheDocument();
    expect(title.textContent.trim()).toBeTruthy();
  });

  it('description is visible', () => {
    expect(getByTestId(document.body, 'test-todo-description')).toBeInTheDocument();
  });

  it('priority badge shows Low, Medium or High', () => {
    const priority = getByTestId(document.body, 'test-todo-priority');
    expect(['Low', 'Medium', 'High']).toContain(priority.textContent.trim());
  });

  it('due date is visible', () => {
    expect(getByTestId(document.body, 'test-todo-due-date')).toBeInTheDocument();
  });

  it('time remaining chip is visible', () => {
    expect(getByTestId(document.body, 'test-todo-time-remaining')).toBeInTheDocument();
  });

  it('status badge is visible', () => {
    expect(getByTestId(document.body, 'test-todo-status')).toBeInTheDocument();
  });

  it('checkbox is a real input type checkbox', () => {
    const checkbox = getByTestId(document.body, 'test-todo-complete-toggle');
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.type).toBe('checkbox');
  });

  it('checkbox can be checked and unchecked', () => {
    const checkbox = getByTestId(document.body, 'test-todo-complete-toggle');
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('tags list is visible', () => {
    expect(getByTestId(document.body, 'test-todo-tags')).toBeInTheDocument();
  });

  it('work and urgent tags exist', () => {
    expect(getByTestId(document.body, 'test-todo-tag-work')).toBeInTheDocument();
    expect(getByTestId(document.body, 'test-todo-tag-urgent')).toBeInTheDocument();
  });

  it('edit button is visible and focusable', () => {
    const btn = getByTestId(document.body, 'test-todo-edit-button');
    expect(btn).toBeInTheDocument();
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('delete button is visible and focusable', () => {
    const btn = getByTestId(document.body, 'test-todo-delete-button');
    expect(btn).toBeInTheDocument();
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('checkbox is focusable', () => {
    const checkbox = getByTestId(document.body, 'test-todo-complete-toggle');
    checkbox.focus();
    expect(document.activeElement).toBe(checkbox);
  });
});
