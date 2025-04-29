import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, forkJoin, map, of } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class MedicineKitService {
  private apiUrlMedicineKit = environment.api_url + '/medicineKit';
  private apiUrlMedicine = environment.api_url + '/medicine';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store<GlobalStateDTO>) {}

  fetchUserMedicineKits(
    userId: number,
    role: string
  ): Observable<MedicineKitDTO[]> {
    const patientKits$ = this.fetchPatientMedicineKits(userId);

    const caretakerKits$ =
      role === 'caretaker' ? this.fetchCaretakerMedicineKits(userId) : of([]);

    const familyMemberKits$ =
      role === 'family member'
        ? this.fetchFamilyMemberMedicineKits(userId)
        : of([]);

    return forkJoin([patientKits$, caretakerKits$, familyMemberKits$]).pipe(
      map(([patientKits, caretakerKits, familyMemberKits]) => [
        ...patientKits,
        ...caretakerKits,
        ...familyMemberKits,
      ])
    );
  }

  fetchPatientMedicineKits(userId: number): Observable<MedicineKitDTO[]> {
    return this.http.get<MedicineKitDTO[]>(`${this.apiUrlMedicineKit}/user`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });
  }

  fetchCaretakerMedicineKits(userId: number): Observable<MedicineKitDTO[]> {
    return this.http.get<MedicineKitDTO[]>(
      `${this.apiUrlMedicineKit}/caretaker`,
      {
        withCredentials: true,
        params: { caretakerId: userId.toString() },
      }
    );
  }

  fetchFamilyMemberMedicineKits(userId: number): Observable<MedicineKitDTO[]> {
    return this.http.get<MedicineKitDTO[]>(
      `${this.apiUrlMedicineKit}/familyMember`,
      {
        withCredentials: true,
        params: { familyMemberId: userId.toString() },
      }
    );
  }

  fetchMedicineKitById(medicineKitId: number): Observable<MedicineKitDTO> {
    return this.http.get<MedicineKitDTO>(`${this.apiUrlMedicineKit}`, {
      withCredentials: true,
      params: { medicineKitId: medicineKitId.toString() },
    });
  }

  deleteMedicineById(medicineId: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('medicineId', medicineId.toString());

    return this.http.delete<any>(`${this.apiUrlMedicine}`, {
      body: body.toString(),
      withCredentials: true,
      headers: headers,
    });
  }

  addMedicineKit(medicineKit: MedicineKitDTO): Observable<MedicineKitDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('name', medicineKit.name);
    body.set('note', medicineKit.note);
    body.set('ownerId', medicineKit.owner.id.toString());

    return this.http.post<MedicineKitDTO>(
      `${this.apiUrlMedicineKit}`,
      body.toString(),
      {
        withCredentials: true,
        headers: headers,
      }
    );
  }

  fetchMedicinesCIMA(medicineName: string): Observable<any> {
    return this.http.get<any>(`https://cima.aemps.es/cima/rest/medicamentos?nombre=${medicineName}`);
  }
}
