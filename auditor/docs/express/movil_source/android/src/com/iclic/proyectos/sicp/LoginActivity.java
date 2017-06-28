package com.iclic.proyectos.sicp;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.iclic.proyectos.sicp.model.Publicidad;
import com.iclic.proyectos.sicp.remotemodel.RemoteModel;
import com.loopj.android.http.AsyncHttpResponseHandler;

public class LoginActivity extends Activity {
	
	EditText texto;
	Button boton;
	SharedPreferences prefs;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_login);
		
		prefs = this.getSharedPreferences(Publicidad.PREFS_NAME, 0);
		String logininfo = prefs.getString("loginInformation", "");
		if (!logininfo.equals("")){
			
			try {
				JSONObject o = new JSONObject(logininfo);
				String role = o.getString("role");
				openRole(role);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}else{
			//init view
			texto = (EditText) findViewById(R.id.editText1);
			boton = (Button) findViewById(R.id.button1);
			boton.setOnClickListener(clickListener);
		}
		
		
	}
	OnClickListener clickListener = new OnClickListener(){

		@Override
		public void onClick(View arg0) {
			RemoteModel.doLogin(texto.getText().toString(),	new AsyncHttpResponseHandler() {
				@Override
				public void onSuccess(String response) {
					
					Log.i("prueba",response);
					try {
						JSONObject o = new JSONObject(response);
						Object error =  o.get("code");
						if (!error.toString().equals("100")){
							SharedPreferences.Editor edit = prefs.edit();
							edit.putString("loginInformation", response);
							edit.commit();
							
							String role = o.getString("role");
							openRole(role);
							
							
						}else{
							Toast.makeText(LoginActivity.this, "Error de llave", Toast.LENGTH_LONG).show();
						}
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
					
				}
			});
		}
		
	};
	private void openRole(String role){
		if (role.equals("supplier")){
			Intent intent = new Intent(LoginActivity.this, ProveedorActivity.class);
			startActivity(intent);
			finish();
		}
	}

}
