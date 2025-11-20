
import type { CharacterOptions } from './types';

export const GRADES = [
  'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
];

export const GRADE_SUBJECTS_MAP: Record<string, string[]> = {
  'Kindergarten': ['Counting', 'Basic Addition', 'Basic Subtraction', 'Shapes'],
  '1st Grade': ['Addition to 20', 'Subtraction within 20', 'Place Value', 'Measurement'],
  '2nd Grade': ['Addition with Regrouping', 'Subtraction with Regrouping', 'Time & Money', 'Arrays'],
  '3rd Grade': ['Multiplication', 'Division', 'Fractions', 'Area & Perimeter'],
  '4th Grade': ['Multi-digit Multiplication', 'Long Division', 'Equivalent Fractions', 'Decimals'],
  '5th Grade': ['Order of Operations', 'Fractions (All Operations)', 'Volume', 'Coordinate Plane'],
  '6th Grade': ['Ratios & Proportions', 'Expressions & Equations', 'Statistics', 'Integers'],
  '7th Grade': ['Proportional Relationships', 'Inequalities', 'Circles & Geometry', 'Probability'],
  '8th Grade': ['Linear Equations', 'Functions', 'Pythagorean Theorem', 'Scientific Notation'],
  '9th Grade': ['Algebra I: Linear Systems', 'Algebra I: Quadratics', 'Geometry: Proofs', 'Geometry: Triangles'],
  '10th Grade': ['Algebra II: Polynomials', 'Geometry: Circles', 'Trigonometry', 'Logarithms'],
  '11th Grade': ['Pre-Calculus', 'Advanced Functions', 'Matrices', 'Conic Sections'],
  '12th Grade': ['Calculus: Limits', 'Calculus: Derivatives', 'Statistics & Probability', 'Discrete Math'],
};

export const DEFAULT_CHARACTER: CharacterOptions = {
  skinColor: '#F2D2B3',
  hairStyle: 'short',
  hairColor: '#4A2A15',
  shirtColor: '#4E939A',
  pantsColor: '#2C3A74',
  shoesColor: '#333333',
};

export const CUSTOMIZATION_OPTIONS = {
  skinColor: ['#F2D2B3', '#D0A98F', '#A38671', '#7F6253', '#5B3A29'],
  hairStyle: ['short', 'long', 'mohawk'],
  hairColor: ['#4A2A15', '#222222', '#C29849', '#E04F34', '#9A9A9A'],
  shirtColor: ['#4E939A', '#B53331', '#6AAA3B', '#E3E3E3', '#F8D62F'],
  pantsColor: ['#2C3A74', '#555555', '#365314', '#7F1D1D', '#644117'],
  shoesColor: ['#333333', '#644117', '#71717A', '#1E3A8A', '#991B1B'],
};
