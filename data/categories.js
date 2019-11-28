import Category from '../models/category';
import Colours from '../constants/Colours';

const moccasin =  Colours.moccasin;

export const CATEGORIES = [
	new Category('c1', 'Καινή Διαθήκη', moccasin), // lemonchiffon
	new Category('c2', 'Παλαιά Διαθήκη', moccasin), // paleturquoise
	new Category('c3', 'Αγιολογικά', moccasin), // lightskyblue
	new Category('c4', 'Λειτουργικά', moccasin), // linen
	new Category('c5', 'Εκκλησιαστική Ιστορία', moccasin), // moccasin
	new Category('c6', 'Δόγματα', moccasin), // lightsteelblue
	new Category('c7', 'Ιεροί Κανόνες', moccasin), // moccasin_light
	new Category('c8', 'Αντιαιρετικά', moccasin), // moccasin_light
];








