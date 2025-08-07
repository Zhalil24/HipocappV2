export interface UserProfileEditModel {
  id: number;
  
  username: string;
  name: string;
  surname: string; 
  photo?: File | null;
  email: string;
  
  
}
