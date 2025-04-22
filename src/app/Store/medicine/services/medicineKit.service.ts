import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, concat } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class MedicineKitService {
  private apiUrl = environment.api_url + '/medicineKit';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store<GlobalStateDTO>) {}

  fetchUserMedicineKits(userId: number, role: string): Observable<MedicineKitDTO[]> {
    let response: Observable<MedicineKitDTO[]> = this.fetchPatientMedicineKits(userId);

    if (role === 'caretaker') {
      return concat(response, this.fetchCaretakerMedicineKits(userId));
    } else if (role === 'family member') {
      return concat(response, this.fetchFamilyMemberMedicineKits(userId));
    } else return response;
  }

  fetchPatientMedicineKits(userId: number): Observable<MedicineKitDTO[]> {
    return this.http.get<MedicineKitDTO[]>(
      `${this.apiUrl}/user`,
      {
        withCredentials: true,
        params: { userId: userId.toString() },
      }
    );
  }

  fetchCaretakerMedicineKits(userId: number): Observable<any> {
    return this.http.get<MedicineKitDTO>(
      `${this.apiUrl}/caretaker`,
      {
        withCredentials: true,
        params: { caretakerId: userId.toString() },
      }
    );
  }

  fetchFamilyMemberMedicineKits(userId: number): Observable<any> {
    return this.http.get<MedicineKitDTO>(
      `${this.apiUrl}/familyMember`,
      {
        withCredentials: true,
        params: { familyMemberId: userId.toString() },
      }
    );
  }
}
