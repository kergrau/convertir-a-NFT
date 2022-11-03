import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessToNFTComponent } from './components/access-to-nft/access-to-nft.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

const routes: Routes = [
    { path: 'upload', component: UploadFileComponent },
    { path: 'nft', component: AccessToNFTComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
