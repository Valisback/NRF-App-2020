import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Contact } from './model/contact';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  infoFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private db: AngularFireDatabase,
    private navCtrl: NavController,
    public toastController: ToastController

  ) {
    this.createForm();
  }


  ngOnInit() {
  }

  createForm() {
    this.infoFormGroup = this.formBuilder.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      jobtitle: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      organization: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),

    });
  }

  onSubmit() {
    const data = Object.assign({}, this.infoFormGroup.value);
    const name = data.firstname + ' ' + data.lastname;
    const jobtitle = data.jobtitle;
    const email = data.email;
    const organization = data.organization;
    const message = data.message;
    const date = new Date();

    if (this.infoFormGroup.valid === false) {
      console.log('not valid', this.infoFormGroup);
      return;
    }
    const html = `
    <div> From: ${name} </div>
    <div> Job Title: ${jobtitle} at ${organization} </div>
    <div> Email: <a href = "mailto: ${email}">${email}</a></div>
    <div> Date: ${date} </div>
    <div> Message: ${message} </div>
     `;

    let formRequest = { name, email, organization, message, date, html };
    this.db.list('/messages').push(formRequest);
    this.navCtrl.back();
    this.infoFormGroup.reset();
    this.presentToast();

  }

  onBack() {
    this.navCtrl.back();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your message has been sent successfully.',
      duration: 2000
    });
    toast.present();

  }


}
