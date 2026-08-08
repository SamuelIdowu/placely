import { Listing, ListingProps } from '@/domain/entities/listing';
import { mockEmployerProfileProps } from './employer-profiles';

const now = new Date();
const emp1 = mockEmployerProfileProps.find(e => e.id === 'emp-profile-1')!;
const emp2 = mockEmployerProfileProps.find(e => e.id === 'emp-profile-2')!;

export const mockListingProps: ListingProps[] = [
  {
    id: 'listing-1',
    employerProfileId: emp1.id,
    title: 'Frontend Developer Intern',
    description: 'Join our team to build scalable React applications. You will learn modern frontend practices.',
    disciplines: ['Computer Science', 'Software Engineering'],
    location: 'Lagos, Nigeria',
    isRemote: true,
    status: 'OPEN',
    isModerated: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'listing-2',
    employerProfileId: emp1.id,
    title: 'Backend Node.js Intern',
    description: 'Help us scale our microservices backend using Node.js and TypeScript.',
    disciplines: ['Computer Science'],
    location: 'Lagos, Nigeria',
    isRemote: true,
    status: 'CLOSED',
    isModerated: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'listing-3',
    employerProfileId: emp2.id,
    title: 'Site Engineer Trainee',
    description: 'Hands-on experience in civil engineering on active construction sites.',
    disciplines: ['Civil Engineering', 'Building Technology'],
    location: 'Abuja, Nigeria',
    isRemote: false,
    status: 'OPEN',
    isModerated: false,
    createdAt: now,
    updatedAt: now,
  }
];

export const mockListings: Listing[] = mockListingProps.map(props => new Listing(props));
