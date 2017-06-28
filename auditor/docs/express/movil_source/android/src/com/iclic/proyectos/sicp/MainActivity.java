package com.iclic.proyectos.sicp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.app.TabActivity;
import android.content.ContentResolver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.location.GpsStatus;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.NetworkInfo.State;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RadioGroup;
import android.widget.SimpleAdapter;
import android.widget.TabHost;
import android.widget.Toast;
import android.widget.TabHost.OnTabChangeListener;
import android.widget.TextView;

import com.iclic.proyectos.sicp.model.Foto;
import com.iclic.proyectos.sicp.model.Publicidad;
import com.iclic.proyectos.sicp.remotemodel.RemoteModel;
import com.loopj.android.http.AsyncHttpResponseHandler;

public class MainActivity extends TabActivity {
	List<Publicidad> model = new ArrayList<Publicidad>();
	PublicidadAdapter adapter = null;
	EditText pubId = null;
	EditText desc = null;
	RadioGroup types = null;

	LinearLayout images = null;
	protected boolean clicked;
	private LocationManager locationManager;
	private boolean wifigps;
	private boolean isGPSFix;
	

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		model = Publicidad.GetAll(this);

		pubId = (EditText) findViewById(R.id.pubid);
		desc = (EditText) findViewById(R.id.descrip);
		types = (RadioGroup) findViewById(R.id.types);
		images = (LinearLayout) findViewById(R.id.fotocontainer);

		Integer[] mThumbIds = { R.drawable.camera,R.drawable.save};
	    String[] mLabels = {"Tomar una foto","Guardar"};
		
	    GridView lista = (GridView) findViewById(R.id.gridview);
        
        List<HashMap<String,String>> aList = new ArrayList<HashMap<String,String>>(); 
        
        for(int i=0;i<mLabels.length;i++)
        {
        	HashMap<String,String> hm=new HashMap<String,String>();
        	hm.put("txt", mLabels[i]);
        	hm.put("img", Integer.toString(mThumbIds[i]));
        	aList.add(hm);
        }
        
        String[] from={"img","txt"};
        
        int[] to = {R.id.img,R.id.txt};
        
        SimpleAdapter adapterG=new SimpleAdapter(getBaseContext(),aList,R.layout.imgs_labels,from,to);
        
        lista.setAdapter(adapterG);
        lista.setOnItemClickListener(itemsClick);
        
        View tab1 = LayoutInflater.from(this).inflate(R.layout.tab_layout, null);
        ImageView img1 = (ImageView) tab1.findViewById(R.id.icon);
        img1.setBackgroundResource(R.drawable.list);
        TextView txt1 = (TextView) tab1.findViewById(R.id.label);
        txt1.setText("Lista");
        
        View tab2 = LayoutInflater.from(this).inflate(R.layout.tab_layout, null);
        ImageView img2 = (ImageView) tab2.findViewById(R.id.icon);
        img2.setBackgroundResource(R.drawable.advertising);
        TextView txt2 = (TextView) tab2.findViewById(R.id.label);
        txt2.setText("Publicidad");
        
		//Button save = (Button) findViewById(R.id.save);

		//save.setOnClickListener(onSave);

		ListView list = (ListView) findViewById(R.id.publicidads);

		adapter = new PublicidadAdapter();
		list.setAdapter(adapter);
		getAllLocationsFromWeb(this);

		getTabHost().setOnTabChangedListener(onTabChangeListener);

		TabHost.TabSpec spec = getTabHost().newTabSpec("tag1");

		spec.setContent(R.id.publicidads);
		//spec.setIndicator("Lista", null);
		spec.setIndicator(tab1);
		getTabHost().addTab(spec);

		spec = getTabHost().newTabSpec("tag2");
		spec.setContent(R.id.details);
		//spec.setIndicator("Publicidad", null);
		spec.setIndicator(tab2);
		getTabHost().addTab(spec);

		getTabHost().setCurrentTab(0);

		list.setOnItemClickListener(onListClick);

		//Button phototake = (Button) findViewById(R.id.photo);
		//phototake.setOnClickListener(cameraClick);

		locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates(
				LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);
		locationManager.addGpsStatusListener(gpsStatus);
		Publicidad.lastLocation = getLastBestLocation();
	}

	LocationListener locationListener = new LocationListener() {
		public void onLocationChanged(Location location) {
			Publicidad.lastLocation = location;
			Log.i("location", location.toString());
		}

		public void onStatusChanged(String provider, int status, Bundle extras) {
		}

		public void onProviderEnabled(String provider) {
		}

		public void onProviderDisabled(String provider) {
		}
	};
	OnTabChangeListener onTabChangeListener = new OnTabChangeListener() {

		@Override
		public void onTabChanged(String arg0) {
			if ((getTabHost().getCurrentTab() == 1) && !clicked) {
				selectedPublicidad = new Publicidad();
				redrawDetailWithPublicidad(selectedPublicidad);
			}
			clicked = false;
		}
	};
	
	private void getAllLocationsFromWeb(final Context c)
	{
		ConnectivityManager conMan = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
		//mobile
		State mobile = conMan.getNetworkInfo(0).getState();
		//wifi
		State wifi = conMan.getNetworkInfo(1).getState();
		if(mobile == NetworkInfo.State.CONNECTED || wifi == NetworkInfo.State.CONNECTED)
		{
			AsyncTask<Void,String,Void> sync = new AsyncTask<Void,String,Void>(){

				private ProgressDialog pd;
				private int total;
				private int loaded;
			
				@Override
				protected void onPreExecute()
				{
					pd = new ProgressDialog(c);
					pd.setTitle("Sincronizando...");
					pd.setMessage("Obteniendo sitios...");
					pd.setCancelable(false);
					pd.setIndeterminate(true);
					pd.setProgressStyle(ProgressDialog.STYLE_SPINNER);
					pd.setProgress(0);
					pd.show();
				
				}
			
				@Override
				protected Void doInBackground(Void... params) {
				
						RemoteModel.getLocations(new AsyncHttpResponseHandler(){
							@Override
							public void onSuccess(String response) {
								try {
									JSONObject o = new JSONObject(response);
									String code = o.getString("code");
									if (code.equals("0")){
										Publicidad p;
										JSONArray arr = o.getJSONArray("data");
										total=arr.length();
										SharedPreferences sh =getSharedPreferences(Publicidad.PREFS_NAME, 0);
										SharedPreferences.Editor edit = sh.edit();
										edit.putInt("location_count", arr.length());
										for (int n = 0; n< arr.length(); n++,loaded++){
											JSONObject ob = arr.getJSONObject(n);
											edit.putString("location_"+(n),ob.getString("code"));
											if(!Publicidad.thereLocally(c, ob.getString("code")))
											{
												p = new Publicidad();
												p.pubId=ob.getString("code");
												switch(ob.getInt("active"))
												{
													case 0:
														p.type="Mal";
														break;
													case 1:
														p.type="Bien";
												}
												p.save(c);
												p=null;
												publishProgress(0+"",n+1+"",arr.length()+"",ob.getString("code"),ob.getInt("active")+"");
											}
											else
												publishProgress(1+"",n+1+"",arr.length()+"");
										}
										edit.commit();
								
								
									}
							
								} catch (JSONException e) {
							// 		TODO Auto-generated catch block
									e.printStackTrace();
								}
						
						
							}
							
							@Override
						    public void onFailure(Throwable e, String response) {
						         // Response failed :(
								pd.dismiss();
						    }
						});
						return null;
				}
			
				@Override
				protected void onProgressUpdate(String... params)
				{
					total=Integer.parseInt(params[2]);
					loaded=Integer.parseInt(params[1]);
					switch(Integer.parseInt(params[0]))
					{
						case 0:
							pd.setMessage("Obteniendo sitios ("+loaded+" de "+total+")");
							Publicidad p=new Publicidad(params[3]);
							switch(Integer.parseInt(params[4]))
							{
								case 0:
									p.type="Mal";
									break;
								case 1:
									p.type="Bien";
							}
							adapter.add(p);
							adapter.notifyDataSetChanged();
							p=null;
							if(loaded>=total)
							{
								pd.dismiss();
							}
							break;
						case 1:
							if(loaded>=total)
								pd.dismiss();
					}
				}
			
				@Override
				protected void onPostExecute(Void result)
				{
				
				}
			};
			sync.execute((Void[])null);
		}
		else
			Toast.makeText(this, "Es necesario tener una conexión a internet", Toast.LENGTH_LONG).show();
	}

	/*private View.OnClickListener onSave = new View.OnClickListener() {
		public void onClick(View v) {
			if (selectedPublicidad == null) {
				selectedPublicidad = new Publicidad();
			}

			selectedPublicidad.pubId = (pubId.getText().toString());
			selectedPublicidad.details = (desc.getText().toString());

			switch (types.getCheckedRadioButtonId()) {
			case R.id.bien:
				selectedPublicidad.type = ("Bien");
				break;

			case R.id.mal:
				selectedPublicidad.type = ("Mal");
				break;

			case R.id.medio:
				selectedPublicidad.type = ("Medio");
				break;

			}

			if (selectedPublicidad.pos == -1)
				adapter.add(selectedPublicidad);
			selectedPublicidad.save(MainActivity.this);

			adapter.notifyDataSetChanged();

			selectedPublicidad = null;
			getTabHost().setCurrentTab(0);
		}
	};*/

	Publicidad selectedPublicidad = null;

	private AdapterView.OnItemClickListener onListClick = new AdapterView.OnItemClickListener() {
		public void onItemClick(AdapterView<?> parent, View view, int position,
				long id) {
			selectedPublicidad = model.get(position);
			clicked = true;

			redrawDetailWithPublicidad(selectedPublicidad);

			getTabHost().setCurrentTab(1);
		}
	};

	public void redrawDetailWithPublicidad(Publicidad selectedPublicidad) {
		pubId.setText(selectedPublicidad.pubId);
		desc.setText(selectedPublicidad.details);

		if (selectedPublicidad.type.equals("Bien")) {
			types.check(R.id.bien);
		} else if (selectedPublicidad.type.equals("Mal")) {
			types.check(R.id.mal);
		} else {
			types.check(R.id.medio);
		}
		
		images.removeAllViews();
		
		for (Foto f: selectedPublicidad.fotos){
			pushFotoToDrawing(f);
		}

	}

	class PublicidadAdapter extends ArrayAdapter<Publicidad> {
		PublicidadAdapter() {
			super(MainActivity.this, R.layout.row, model);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			View row = convertView;
			PublicidadHolder holder = null;

			if (row == null) {
				LayoutInflater inflater = getLayoutInflater();

				row = inflater.inflate(R.layout.row, parent, false);
				holder = new PublicidadHolder(row);
				row.setTag(holder);
			} else {
				holder = (PublicidadHolder) row.getTag();
			}

			holder.populateFrom(model.get(position));

			return (row);
		}
	}

	static class PublicidadHolder {
		private TextView name = null;
		private TextView address = null;
		private ImageView icon = null;

		// private View row = null;

		PublicidadHolder(View row) {
			// this.row = row;

			name = (TextView) row.findViewById(R.id.title);
			address = (TextView) row.findViewById(R.id.desc);
			icon = (ImageView) row.findViewById(R.id.icon);
		}

		void populateFrom(Publicidad r) {
			name.setText(r.pubId);
			address.setText(r.details);

			if (r.type.equals("Mal")) {
				icon.setImageResource(R.drawable.ball_red);
			} else if (r.type.equals("Bien")) {
				icon.setImageResource(R.drawable.ball_green);
			} else {
				icon.setImageResource(R.drawable.ball_yellow);
			}

		}
	}

	OnItemClickListener itemsClick = new OnItemClickListener(){

		@Override
		public void onItemClick(AdapterView<?> arg0, View arg1, int arg2,
				long arg3) {
			switch(arg2)
			{
				case 0:
					ConnectivityManager conMan = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
					//mobile
					State mobile = conMan.getNetworkInfo(0).getState();
					//wifi
					State wifi = conMan.getNetworkInfo(1).getState();
					if(!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
						buildAlertMessageNoGps(0);
					else
					{
						if(!wifigps)
						{
							if(!isGPSFix)
								buildAlertMessageNoGps(1);
							else
							{
								Publicidad.lastLocation = getLastBestLocation();
								if(Publicidad.lastLocation!=null)
									dispatchTakePictureIntent(0);
								else
									Toast.makeText(MainActivity.this, "Ubicación no establecida", Toast.LENGTH_LONG).show();
							}
						}
						else if(isWifiLocationEnabled())
						{
							if(mobile == NetworkInfo.State.CONNECTED || wifi == NetworkInfo.State.CONNECTED)
							{
								Publicidad.lastLocation = getLastBestLocation();
								if(Publicidad.lastLocation!=null)
									dispatchTakePictureIntent(0);
								else
									Toast.makeText(MainActivity.this, "Ubicación no establecida", Toast.LENGTH_LONG).show();
							}
							else
								Toast.makeText(MainActivity.this, "La conexión wifi/2G/3G/4G no ha sido establecida", Toast.LENGTH_LONG).show();
						}
						else
						{
							buildAlertMessageNoGps(2);
						}
					}
					break;
				case 1:
					if (selectedPublicidad == null) {
						selectedPublicidad = new Publicidad();
					}

					selectedPublicidad.pubId = (pubId.getText().toString());
					selectedPublicidad.details = (desc.getText().toString());

					switch (types.getCheckedRadioButtonId()) {
					case R.id.bien:
						selectedPublicidad.type = ("Bien");
						break;

					case R.id.mal:
						selectedPublicidad.type = ("Mal");
						break;

					case R.id.medio:
						selectedPublicidad.type = ("Medio");
						break;

					}

					if (selectedPublicidad.pos == -1)
						adapter.add(selectedPublicidad);
					selectedPublicidad.save(MainActivity.this);

					adapter.notifyDataSetChanged();

					selectedPublicidad = null;
					getTabHost().setCurrentTab(0);
			}
			
		}};
		
		private boolean isWifiLocationEnabled () {
		    ContentResolver cr = getBaseContext().getContentResolver();
		    String enabledProviders = Settings.Secure.getString(cr, Settings.Secure.LOCATION_PROVIDERS_ALLOWED);
		    if (!TextUtils.isEmpty(enabledProviders)) {
		        // not the fastest way to do that :)
		        String[] providersList = TextUtils.split(enabledProviders, ",");
		        for (String provider : providersList) {
		            if (LocationManager.NETWORK_PROVIDER.equals(provider)) {
		                return true;
		            }
		        }
		    }
		    return false;
		}
		
		private GpsStatus.Listener gpsStatus = new GpsStatus.Listener() {
			
			@Override
			public void onGpsStatusChanged(int event) {
				switch(event)
				{
					case GpsStatus.GPS_EVENT_SATELLITE_STATUS:
						if (isGPSFix) { 
							wifigps=false;
						}
	                break;
					case GpsStatus.GPS_EVENT_STOPPED:
						isGPSFix=false;
						Toast.makeText(MainActivity.this, "Se ha perdido la conexión a través del GPS", Toast.LENGTH_LONG).show();
						break;
					case GpsStatus.GPS_EVENT_FIRST_FIX:
		                isGPSFix = true;
		                wifigps=false;
		                Toast.makeText(MainActivity.this, "Conexión establecida a traves del GPS", Toast.LENGTH_LONG).show();
				}
				
			}
		};
		
		private void buildAlertMessageNoGps(final int op) {
		    final AlertDialog.Builder builder = new AlertDialog.Builder(this);
		    String msg=""; 
		    switch(op)
		    {
		    	case 0:
		    		msg="Para obtener su ubicación actual por GPS es necesario habilitar lo siguiente:\n-Utilizar satélites GPS.\n¿Desea habilitarlo?";
		    		break;
		    	case 1:
		    		msg="El GPS todavía no establece conexión.\n¿Desea probar con otra conexión(wifi/2G/3G/4G)?";
		    		break;
		    	case 2:
		    		msg="Para obtener su ubicación actual por wifi, 2G, 3G o 4G es necesario habilitar lo siguiente:\n-Utilizar redes inalambricas.\n¿Desea habilitarlo?";
		    }
		    builder.setMessage(msg)
		           .setCancelable(false)
		           .setPositiveButton("Si", new DialogInterface.OnClickListener() {
		               public void onClick(@SuppressWarnings("unused") final DialogInterface dialog, @SuppressWarnings("unused") final int id) {
		            	   switch(op)
		            	   {
		            	   		case 0:
		            	   		case 2:
		            	   			startActivity(new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS));
		            	   			break;
		            	   		case 1:
		            	   			wifigps=true;
		            	   			startActivity(new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS));
		            	   }
		                   
		               }
		           })
		           .setNegativeButton("No", new DialogInterface.OnClickListener() {
		               public void onClick(final DialogInterface dialog, @SuppressWarnings("unused") final int id) {
		                    dialog.cancel();
		               }
		           });
		    final AlertDialog alert = builder.create();
		    alert.show();
		}
	
	/*OnClickListener cameraClick = new OnClickListener() {

		@Override
		public void onClick(View arg0) {
			dispatchTakePictureIntent(0);
		}

	};*/

	private void dispatchTakePictureIntent(int actionCode) {
		Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
		startActivityForResult(takePictureIntent, actionCode);
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (data != null)// no toma foto
			handleSmallCameraPhoto(data);
	}

	Foto mImage = null;

	private void handleSmallCameraPhoto(Intent intent) {
		Bundle extras = intent.getExtras();
		Bitmap mImageBitmap = (Bitmap) extras.get("data");
		Foto f = new Foto(mImageBitmap);
		this.pushFotoToDrawing(f);
		
		this.selectedPublicidad.fotos.add(f);
		//image.setImageBitmap(mImageBitmap);
		// mVideoUri = null;
		//image.setVisibility(View.VISIBLE);
	}
	
	private void pushFotoToDrawing(Foto f){
		ImageView img = new ImageView(this);
		img.setImageBitmap(f.image);
		images.addView(img);
		img.setVisibility(View.VISIBLE);
	}

	public Location getLastBestLocation() {
		Location bestResult = null;
		float bestAccuracy = Float.MAX_VALUE;
		long bestTime = Long.MIN_VALUE;

		// Iterate through all the providers on the system, keeping
		// note of the most accurate result within the acceptable time limit.
		// If no result is found within maxTime, return the newest Location.
		List<String> matchingProviders = locationManager.getAllProviders();
		for (String provider : matchingProviders) {
			Location location = locationManager.getLastKnownLocation(provider);
			if (location != null) {
				float accuracy = location.getAccuracy();
				long time = location.getTime();

				if ((accuracy < bestAccuracy)) {
					bestResult = location;
					bestAccuracy = accuracy;
					bestTime = time;
				} else if ( bestAccuracy == Float.MAX_VALUE
						&& time > bestTime) {
					bestResult = location;
					bestTime = time;
				}
			}
		}

		return bestResult;
	}
}