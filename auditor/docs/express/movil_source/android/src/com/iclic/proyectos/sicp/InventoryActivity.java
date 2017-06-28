package com.iclic.proyectos.sicp;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.iclic.proyectos.sicp.model.Foto;
import com.iclic.proyectos.sicp.model.Inventory;
import com.iclic.proyectos.sicp.model.Inventory;
import com.iclic.proyectos.sicp.remotemodel.RemoteModel;
import com.loopj.android.http.AsyncHttpResponseHandler;

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
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewManager;
import android.view.View.OnClickListener;
import android.view.View.OnLongClickListener;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.TabHost.OnTabChangeListener;

public class InventoryActivity extends TabActivity 
{
	
	List<Inventory> model = new ArrayList<Inventory>();
	static InventoryAdapter adapter = null;
	TextView invId = null;
	TextView pubId = null;
	TextView from = null;
	TextView to = null;
	TextView content = null;
	ListView list;


	LinearLayout images = null;
	protected boolean clicked;
	private LocationManager locationManager;
	private boolean isGPSFix;
	private boolean wifigps;
	

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_inventory);
		
		//File imgsFolder = new File("/sdcard/iClicAuditor/");
		//imgsFolder.mkdirs();
		Inventory.setPreferences( this.getSharedPreferences(Inventory.PREFS_NAME, 0) );
		Inventory.context = this;

		model = Inventory.GetAll(this);

		invId = (TextView) findViewById(R.id.invid);
		pubId = (TextView) findViewById(R.id.pubid);
		from = (TextView) findViewById(R.id.from);
		to = (TextView) findViewById(R.id.to);
		content = (TextView) findViewById(R.id.content);
		//pubId.setEnabled(false);
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
        txt2.setText("Inventory");
		
		//Button save = (Button) findViewById(R.id.save);

		//save.setOnClickListener(onSave);

		list = (ListView) findViewById(R.id.inventories);

		adapter = new InventoryAdapter();
		list.setAdapter(adapter);
		getAllInventoriesFromWeb(this);

		getTabHost().setOnTabChangedListener(onTabChangeListener);

		TabHost.TabSpec spec = getTabHost().newTabSpec("tag1");

		spec.setContent(R.id.inventories);
		//spec.setIndicator("Lista", null);
		spec.setIndicator(tab1);
		getTabHost().addTab(spec);

		spec = getTabHost().newTabSpec("tag2");
		spec.setContent(R.id.details);
		//spec.setIndicator("Inventory", null);
		spec.setIndicator(tab2);
		getTabHost().addTab(spec);

		getTabHost().setCurrentTab(0);

		list.setOnItemClickListener(onListClick);

		//Button phototake = (Button) findViewById(R.id.photo);
		//phototake.setOnClickListener(cameraClick);

		locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates(
				LocationManager.GPS_PROVIDER, 0, 0, locationListener);
		locationManager.addGpsStatusListener(gpsStatus);
		Inventory.lastLocation = getLastBestLocation();
	}

	LocationListener locationListener = new LocationListener() {
		public void onLocationChanged(Location location) {
			Inventory.lastLocation = location;
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
				selectedInventory = new Inventory();
				redrawDetailWithInventory(selectedInventory);
				Toast.makeText(InventoryActivity.this, "Nuevo Reporte", Toast.LENGTH_LONG).show();
			}
			clicked = false;
		}
	};
	
	private void getAllInventoriesFromWeb(final Context c)
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
				
						RemoteModel.getInventories("",new AsyncHttpResponseHandler(){
							@Override
							public void onSuccess(String response) {
								try {
									JSONObject o = new JSONObject(response);
									String code = o.getString("code");
									if (code.equals("0")){
										Inventory p;
										JSONArray arr = o.getJSONArray("data");
										total=arr.length();
										SharedPreferences sh =getSharedPreferences(Inventory.PREFS_NAME, 0);
										SharedPreferences.Editor edit = sh.edit();
										edit.putInt("inventory_count", arr.length());
										for (int n = 0; n< arr.length(); n++,loaded++){
											JSONObject ob = arr.getJSONObject(n);
											edit.putString("inventory_"+(n),ob.getString("code"));
											if(!Inventory.thereLocally(c, ob.getString("code")))
											{
												p = new Inventory();
												p.invId=ob.getString("code");
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
											{
												Inventory.updateInv(ob.getString("code"), ob.getInt("active")==0?"Mal":"Bien", c);
												publishProgress(1+"",n+1+"",arr.length()+"");
											}
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
							Inventory p=new Inventory(params[3]);
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
							{
								pd.dismiss();
							}
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
			if (selectedInventory == null) {
				selectedInventory = new Inventory();
			}

			selectedInventory.pubId = (pubId.getText().toString());
			
			SharedPreferences prefs = getSharedPreferences(Inventory.PREFS_NAME, 0);
			if (Inventory.validId(prefs,selectedInventory.pubId)){
				if (selectedInventory.pos == -1)
					adapter.add(selectedInventory);
				selectedInventory.save(ProveedorActivity.this);

				adapter.notifyDataSetChanged();

				selectedInventory = null;
				Toast.makeText(ProveedorActivity.this, "Grabado localmente", Toast.LENGTH_LONG).show();
				getTabHost().setCurrentTab(0);
			}else{
				Toast.makeText(ProveedorActivity.this, "Id no valido", Toast.LENGTH_LONG).show();
			}
		}
	};*/

	Inventory selectedInventory = null;

	private AdapterView.OnItemClickListener onListClick = new AdapterView.OnItemClickListener() {
		public void onItemClick(AdapterView<?> parent, View view, int position,
				long id) {
			selectedInventory = model.get(position);
			clicked = true;
			redrawDetailWithInventory(selectedInventory);

			getTabHost().setCurrentTab(1);
		}
	};

	public void redrawDetailWithInventory(Inventory selectedInventory) {
		invId.setText(selectedInventory.invId);
		pubId.setText(selectedInventory.pubId);
		from.setText(selectedInventory.from);
		to.setText(selectedInventory.to);
		content.setText(selectedInventory.content);
		
		images.removeAllViews();
		for (Foto f: selectedInventory.fotos){
			pushFotoToDrawing(f);
		}

	}

	class InventoryAdapter extends ArrayAdapter<Inventory> {
		InventoryAdapter() {
			super(InventoryActivity.this, R.layout.row, model);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			View row = convertView;
			InventoryHolder holder = null;

			if (row == null) {
				LayoutInflater inflater = getLayoutInflater();

				row = inflater.inflate(R.layout.row, parent, false);
				holder = new InventoryHolder(row);
				row.setTag(holder);
			} else {
				holder = (InventoryHolder) row.getTag();
			}

			holder.populateFrom(model.get(position));

			return (row);
		}
	}

	static class InventoryHolder {
		private TextView name = null;
		private TextView address = null;
		private ImageView icon = null;

		// private View row = null;

		InventoryHolder(View row) {
			// this.row = row;

			name = (TextView) row.findViewById(R.id.title);
			address = (TextView) row.findViewById(R.id.desc);
			icon = (ImageView) row.findViewById(R.id.icon);
		}

		void populateFrom(Inventory r) {
			name.setText(r.invId);
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
			if (selectedInventory == null) {
				selectedInventory = new Inventory();
			}
			
			switch(arg2)
			{
				case 0:
					ConnectivityManager conMan = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
					//mobile
					State mobile = conMan.getNetworkInfo(0).getState();
					//wifi
					State wifi = conMan.getNetworkInfo(1).getState();
					if(!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
						buildAlertMessage(0,null,null);
					else
					{
						if(!wifigps)
						{
							if(!isGPSFix)
								buildAlertMessage(1,null,null);
							else
							{
								
								if(Inventory.lastLocation!=null)
								{
									if(selectedInventory.fotos.size()<3)
									{
										Inventory.lastLocation = getLastBestLocation();
										dispatchTakePictureIntent(0);
									}
									else
										Toast.makeText(InventoryActivity.this, "Ah llegado al limite de fotos para esta Inventory.", Toast.LENGTH_LONG).show();
								}
								else
									Toast.makeText(InventoryActivity.this, "Ubicación no establecida", Toast.LENGTH_LONG).show();
							}
						}
						else if(isWifiLocationEnabled())
						{
							if(mobile == NetworkInfo.State.CONNECTED || wifi == NetworkInfo.State.CONNECTED)
							{
								if(Inventory.lastLocation!=null)
								{
									if(selectedInventory.fotos.size()<3)
									{
										Inventory.lastLocation = getLastBestLocation();
										dispatchTakePictureIntent(0);
									}
									else
										Toast.makeText(InventoryActivity.this, "Ah llegado al limite de fotos para esta Inventory.", Toast.LENGTH_LONG).show();
								}
								else
									Toast.makeText(InventoryActivity.this, "Ubicación no establecida", Toast.LENGTH_LONG).show();
							}
							else
								Toast.makeText(InventoryActivity.this, "La conexión wifi/2G/3G/4G no ha sido establecida", Toast.LENGTH_LONG).show();
						}
						else
						{
							buildAlertMessage(2,null,null);
						}
					}
					
					break;
				case 1:

					selectedInventory.invId = (invId.getText().toString());
					
					SharedPreferences prefs = getSharedPreferences(Inventory.PREFS_NAME, 0);
					if (Inventory.validId(prefs,selectedInventory.invId)){
						if (selectedInventory.pos == -1)
							adapter.add(selectedInventory);
						if(selectedInventory.fotos.size()==3)
							selectedInventory.type="Pendiente";
						selectedInventory.save(InventoryActivity.this);
						adapter.notifyDataSetChanged();

						selectedInventory = null;
						Toast.makeText(InventoryActivity.this, "Grabado localmente", Toast.LENGTH_LONG).show();
						getTabHost().setCurrentTab(0);
					}else{
						Toast.makeText(InventoryActivity.this, "Id no valido", Toast.LENGTH_LONG).show();
					}
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
						Toast.makeText(InventoryActivity.this, "Se ha perdido la conexión a través del GPS", Toast.LENGTH_LONG).show();
						break;
					case GpsStatus.GPS_EVENT_FIRST_FIX:
		                isGPSFix = true;
		                wifigps=false;
		                Toast.makeText(InventoryActivity.this, "Conexión establecida a través del GPS", Toast.LENGTH_LONG).show();
				}
				
			}
		};
		
		private void buildAlertMessage(final int op,final View img,final Foto f) {
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
		    		break;
		    	case 3:
		    		msg="¿Desea eliminar la imagen?";
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
		            	   			
		            	   			ConnectivityManager conMan = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
		        					//mobile
		        					State mobile = conMan.getNetworkInfo(0).getState();
		        					//wifi
		        					State wifi = conMan.getNetworkInfo(1).getState();
		        					if(wifi!=NetworkInfo.State.CONNECTED && mobile!=NetworkInfo.State.CONNECTED)
		        						startActivity(new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS));
		        					else
		        						wifigps=true;
		        					break;
		            	   		case 3:
		            	   			((ViewManager)img.getParent()).removeView(img);
		            	   			selectedInventory.removePic(getBaseContext(),f);
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
		this.selectedInventory.fotos.add(f);
		Toast.makeText(InventoryActivity.this, "Foto guardada", Toast.LENGTH_LONG).show();
		//image.setImageBitmap(mImageBitmap);
		// mVideoUri = null;
		//image.setVisibility(View.VISIBLE);
	}
	
	private void pushFotoToDrawing(final Foto f){
		LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
		lp.setMargins(10, 0, 10, 0);
		final ImageView img = new ImageView(this);
		img.setLayoutParams(lp);
		img.setImageBitmap(f.image);
		img.setOnClickListener(new OnClickListener(){

			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				Intent fullImg=new Intent(InventoryActivity.this,Full_Screen.class);
				if(f.image!=null)
				{
					Bitmap bitmap = f.image;
					ByteArrayOutputStream stream = new ByteArrayOutputStream();
					bitmap.compress(Bitmap.CompressFormat.JPEG, 100, stream);
					byte[] bitmapdata = stream.toByteArray();
					fullImg.putExtra("Img", bitmapdata);
					startActivity(fullImg);
				}
			}

			});
		img.setOnLongClickListener(new OnLongClickListener(){

			@Override
			public boolean onLongClick(View v) {
				// TODO Auto-generated method stub
				buildAlertMessage(3,img,f);
				return false;
			}});
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
	
	public static void updateRow(int pos)
	{
		adapter.getItem(pos-1).type="Bien";
		adapter.notifyDataSetChanged();
	}
	
	 @Override
	 public boolean onCreateOptionsMenu(Menu menu) {
	     MenuInflater inflater = getMenuInflater();
	     inflater.inflate(R.menu.proveedor, menu);
	     return true;
	 }
	 
	 @Override
	 public boolean onOptionsItemSelected(MenuItem item) {
	     // Handle item selection
	     switch (item.getItemId()) {
	         case R.id.action_upload:
	             Inventory.uploadAll(this);
	             return true;
	         case R.id.action_sync:
	        	 getAllInventoriesFromWeb(this);
	        	 return true;
	         default:
	             return super.onOptionsItemSelected(item);
	     }
	 } 

}
